class API::V1::UsersController < ApplicationController
  respond_to :json
  before_action :set_user, only: [:show, :update, :friendships, :create_friendship]
  before_action :verify_jwt_token, only: [:create, :update, :friendships, :create_friendship]

  def index
    # Verifica si hay un parámetro de búsqueda para el handle
    if params[:handle].present?
      # Utiliza LOWER y LIKE para buscar por el inicio del handle
      @users = User.includes(:reviews, :address).where('LOWER(handle) LIKE ?', "#{params[:handle].downcase}%") 
      
      if @users.empty?
        render json: { message: 'User not found.' }, status: :not_found
      else
        render json: @users, status: :ok
      end
    else
      @users = User.includes(:reviews, :address).all   
      render json: @users, status: :ok
    end
  end

  def show
    # Método show no modificado
  end

  def friendships
    @friends = Friendship.find(params[:id])
  end

  def create_friendship
    friend = User.find_by(id: params[:friend_id]) # Usa find_by para evitar excepciones
    if friend.nil?
      render json: { error: "Friend not found" }, status: :not_found
      return
    end
  
    @friendship = Friendship.new(user_id: @user.id, friend_id: friend.id)
  
    if @friendship.save
      render json: { message: "Friendship created successfully." }, status: :created
    else
      render json: { error: @friendship.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  end
  
  

  def create
    @user = User.new(user_params)
    if @user.save
      render json: @user.id, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def update
    # Método update no modificado
    if @user.update(user_params)
      render :show, status: :ok, location: api_v1_users_path(@user)
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.fetch(:user, {}).
        permit(:id, :first_name, :last_name, :email, :age,
            { address_attributes: [:id, :line1, :line2, :city, :country, :country_id, 
              country_attributes: [:id, :name]],
              reviews_attributes: [:id, :text, :rating, :beer_id, :_destroy]
            })
  end

  def verify_jwt_token
    authenticate_user!
    head :unauthorized unless current_user
  end  
end
