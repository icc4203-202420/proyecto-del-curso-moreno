class ApplicationController < ActionController::API
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :print_current_user

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[name avatar])
    devise_parameter_sanitizer.permit(:account_update, keys: %i[name avatar])
  end

  def current_user
    @current_user ||= User.find_by(id: decoded_token[:user_id]) if decoded_token
  end

  def print_current_user
    Rails.logger.info "Current user: #{current_user.inspect}"
  end

  private

  def decoded_token
    token = request.headers['Authorization']&.split(' ')&.last
    return nil unless token

    begin
      JWT.decode(token, Rails.application.credentials.devise_jwt_secret_key).first
    rescue JWT::DecodeError
      nil
    end
  end

end
