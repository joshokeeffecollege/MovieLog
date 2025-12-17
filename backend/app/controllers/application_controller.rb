# This class serves as the base controller for all other controllers in the application
class ApplicationController < ActionController::API
  before_action :set_security_headers

  # return JSON for common errors instead of HTML/stack traces.
  rescue_from ActiveRecord::RecordNotFound do
    render json: { error: "Not found" }, status: :not_found
  end

  rescue_from ActionController::ParameterMissing do |e|
    render json: { error: e.message }, status: :bad_request
  end

  rescue_from ActiveRecord::ConnectionNotEstablished do
    render json: { error: "Database unavailable" }, status: :internal_server_error
  end

  if defined?(PG)
    rescue_from PG::ConnectionBad do
      render json: { error: "Database unavailable" }, status: :internal_server_error
    end
  end

  rescue_from ActiveRecord::StatementInvalid do |e|
    cause_name = e.cause&.class&.name.to_s
    if cause_name == "PG::UndefinedTable" ||
        e.message.match?(/relation .* does not exist/i) ||
        e.message.match?(/no such table/i)
      render json: { error: "Database not migrated" }, status: :internal_server_error
    else
      raise
    end
  end

  private

  # set security-related HTTP headers
  def set_security_headers
    # protection against MIME sniffing attacks
    response.set_header("X-Content-Type-Options", "nosniff")

    # mitigate clickjacking
    response.set_header("X-Frame-Options", "DENY")

    # reduce referrer leakage
    response.set_header("Referrer-Policy", "no-referrer")

    # disable unnecessary browser APIs
    response.set_header(
      "Permissions-Policy",
      "camera=(), geolocation=(), microphone=(), payment=(), usb=()"
    )
  end

   # JWT token handling methods
   def token_verifier
    @token_verifier ||= ActiveSupport::MessageVerifier.new(
      Rails.application.secret_key_base,
      digest: "SHA256",
      serializer: JSON
    )
  end

  def issue_token(user_id)
    token_verifier.generate({ user_id: user_id, iat: Time.now.to_i })
  end

  def decode_token(token)
    token_verifier.verify(token)
  rescue ActiveSupport::MessageVerifier::InvalidSignature
    nil
  end

  # extract bearer token from Authorization header
  def bearer_token
    header = request.headers["Authorization"].to_s
    return nil unless header.start_with?("Bearer ")
    header.delete_prefix("Bearer ").strip
  end

  # retrieve the currently authenticated user based on the bearer token
  def current_user
    return @current_user if defined?(@current_user)

    payload = bearer_token ? decode_token(bearer_token) : nil

    # Optional expiry: 7 days
    if payload && payload["iat"] && payload["iat"].to_i < 7.days.ago.to_i
      @current_user = nil
      return nil
    end

    @current_user = payload ? User.find_by(id: payload["user_id"]) : nil
  end

  def authenticate_user!
    return true if current_user
    render json: { error: "Unauthorized" }, status: :unauthorized
    false
  end
end
