# Argon2 password hashing for User model
require "argon2"

class User < ApplicationRecord
  # Associations
  has_many :collection_items, dependent: :destroy

  attr_accessor :password, :password_confirmation

  # downcase email before validation
  before_validation do
    self.email = email.to_s.downcase.strip
  end

  # email validations
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }

  # password validations
  validates :password, presence: true, on: :create
  validates :password, confirmation: true, allow_nil: true

  # Hashes the password using Argon2 before saving the user
  before_save do
    next if password.blank?

    # Argon2 hashes include their parameters & salt in the encoded string
    self.password_digest = Argon2::Password.create(password)
  end

  # Authenticates a user by verifying the provided password
  def authenticate(unencrypted_password)
    return false if password_digest.blank?
    return false if unencrypted_password.blank?

    # Argon2 verifies the password against the stored hash
    Argon2::Password.verify_password(unencrypted_password, password_digest) ? self : false
  end
end
