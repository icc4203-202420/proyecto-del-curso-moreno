class FriendshipsController < ApplicationController
    before_action :authenticate_user!
  
    def search
      @users = User.search_by_handle(params[:handle])
      render json: @users, status: :ok
    end
  
    def create
      @friendship = Friendship.new(friendship_params)
      @friendship.user = current_user
  
      if @friendship.save
        render json: @friendship, status: :created
      else
        render json: @friendship.errors, status: :unprocessable_entity
      end
    end
  
    private
  
    def friendship_params
      params.require(:friendship).permit(:friend_id, :event_id)
    end
end
  