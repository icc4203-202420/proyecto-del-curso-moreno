module API
  module V1
    class EventPicturesController < ApplicationController
      include ImageProcessing
      before_action :set_event

      def index
        render json: @event.event_pictures.includes(:user).as_json(include: :user)
      end

      def create
        picture = @event.event_pictures.new(event_picture_params)
        picture.user = User.find(params["user_id"].to_i)
        Rails.logger.debug params

        begin
          if picture.save
            render json: picture, status: :created
          else
            render json: { errors: picture.errors.full_messages }, status: :unprocessable_entity
          end
        rescue => e
          render json: { error: 'Error saving image', details: e.message }, status: :unprocessable_entity
        end
      end

      private

      def set_event
        @event = Event.find(params[:event_id])
      end

      def event_picture_params
        params.require(:event_picture).permit(:image, :description)
      end
    end
  end
end
