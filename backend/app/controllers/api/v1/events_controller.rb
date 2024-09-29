class API::V1::EventsController < ApplicationController
  include ImageProcessing

  respond_to :json
  before_action :set_event, only: [:show, :update, :destroy, :event_pictures] # Agregado :event_pictures
  before_action :set_bar, only: [:create, :update, :destroy] 

  # Acción index que lista todos los eventos
  def index
    @events = Event.includes(:bar).all
    render json: @events.to_json(
      include: {
        bar: {
          only: [:name]
        }
      }
    )
  end

  def show
    if @event.flyer_image.attached?
      render json: @event.as_json.merge({ flyer_image_url: url_for(@event.flyer_image) }), status: :ok
    else
      render json: { event: @event.as_json }, status: :ok
    end
  end

  def event_pictures
    if @event
      pictures = @event.event_pictures.includes(:user).map do |picture|
        {
          id: picture.id,
          user_id: picture.user_id,
          description: picture.description,
          image_url: url_for(picture.image)
        }
      end
      render json: pictures, status: :ok
    else
      render json: { error: 'Event not found' }, status: :not_found
    end
  end

  def create
    @event = @bar.events.new(event_params.except(:flyer_image_base64))
    handle_image_attachment if event_params[:flyer_image_base64]

    if @event.save
      render json: { event: @event, message: 'Event created successfully.' }, status: :created
    else
      render json: { errors: @event.errors }, status: :unprocessable_entity
    end
  end

  def update
    handle_image_attachment if event_params[:flyer_image_base64]

    if @event.update(event_params.except(:flyer_image_base64))
      render json: { event: @event, message: 'Event updated successfully.' }, status: :ok
    else
      render json: { errors: @event.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    if @event.destroy
      render json: { message: 'Event successfully deleted.' }, status: :no_content
    else
      render json: { errors: @event.errors }, status: :unprocessable_entity
    end
  end

  def attendees
    if @event
      users = @event.users
      render json: users, status: :ok
    else
      render json: { error: 'Event not found' }, status: :not_found
    end
  end

  private

  def set_bar
    Rails.logger.debug "Params: #{params.inspect}"
    @bar = Bar.find_by(id: params[:bar_id])
    render json: { error: 'Bar not found' }, status: :not_found unless @bar
  end

  def set_event
    @event = Event.find_by(id: params[:id])
    render json: { error: 'Event not found' }, status: :not_found unless @event
  end

  def event_params
    params.require(:event).permit(
      :name, :description, :date, :bar_id, :flyer_image_base64
    )
  end

  def handle_image_attachment
    decoded_image = decode_image(event_params[:flyer_image_base64])
    @event.flyer_image.attach(io: decoded_image[:io], filename: decoded_image[:filename], content_type: decoded_image[:content_type])
  end
end
