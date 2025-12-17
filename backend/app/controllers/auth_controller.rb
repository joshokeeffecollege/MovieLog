# This controller handles user authentication actions such as signup, login, and fetching the current user's details
class AuthController < ApplicationController
  # POST /signup
  def signup
    user = User.new(signup_params)

    if user.save
      render json: { token: issue_token(user.id), user: { id: user.id, email: user.email } }, status: :created
    else
      render json: { errors: user.errors }, status: :unprocessable_entity
    end
  end

  # POST /login
  def login
    # downcase email for consistency
    email = params.require(:email).to_s.downcase.strip
    password = params.require(:password).to_s

    # find user by email
    user = User.find_by(email: email)

    # authenticate user and issue token
    if user&.authenticate(password)
      render json: { token: issue_token(user.id), user: { id: user.id, email: user.email } }
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  # GET /me
  def me
    return unless authenticate_user!
    render json: { user: { id: current_user.id, email: current_user.email } }
  end

  private

  def signup_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end
