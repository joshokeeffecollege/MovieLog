require "argon2"

class User < ApplicationRecord
  # NOTE: Rails `has_secure_password` requires bcrypt.
  # Since this project uses Argon2, we implement password hashing manually.
  #
  # Database column: `password_digest` (string, not null)
  # Virtual attributes: `password`, `password_confirmation`

  attr_accessor :password, :password_confirmation

  before_validation do
    self.email = email.to_s.downcase.strip
  end

  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }

  validates :password, presence: true, on: :create
  validates :password, confirmation: true, allow_nil: true

  before_save do
    next if password.blank?

    # Argon2 hashes include their parameters & salt in the encoded string.
    self.password_digest = Argon2::Password.create(password)
  end

  # Returns `self` if password matches, otherwise `false` (mirrors has_secure_password behavior).
  def authenticate(unencrypted_password)
    return false if password_digest.blank?
    return false if unencrypted_password.blank?

    Argon2::Password.verify_password(unencrypted_password, password_digest) ? self : false
  end
end
