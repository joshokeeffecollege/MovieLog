class ApplicationController < ActionController::API
  before_action :set_security_headers

  # return JSON for common errors instead of HTML/stack traces.
  rescue_from ActiveRecord::RecordNotFound do
    render json: { error: "Not found" }, status: :not_found
  end

  rescue_from ActionController::ParameterMissing do |e|
    render json: { error: e.message }, status: :bad_request
  end

  private

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
end
