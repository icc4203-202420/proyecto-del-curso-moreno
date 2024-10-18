class API::V1::ReviewsController < ApplicationController
  respond_to :json
  before_action :authenticate_user!
  before_action :set_user, only: [:index, :create]
  before_action :set_review, only: [:show, :update, :destroy]
  before_action :set_beer, only: [:create]

  def index
    @reviews = Review.where(user: @user)
    render json: { reviews: @reviews }, status: :ok
  end

  def show
    if @review
      render json: { review: @review }, status: :ok
    else
      render json: { error: "Review not found" }, status: :not_found
    end
  end

  def create
    Rails.logger.debug "Current user: #{current_user.inspect}"
    @beer = Beer.find(params[:beer_id])
    @review = @beer.reviews.build(review_params.merge(user: current_user))
    if @review.save
      render json: @review, status: :created, location: api_v1_review_url(@review)
    else
      render json: { error: @review.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def update
    if @review.update(review_params)
      render json: @review, status: :ok
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @review.destroy
    head :no_content
  end

  private

  def set_review
    @review = Review.find_by(id: params[:id])
    render json: { error: "Review not found" }, status: :not_found unless @review
  end

  def set_user
    @user = current_user
    Rails.logger.debug("Current user: #{@user.inspect}")
    render json: { error: "User not authenticated" }, status: :unauthorized unless @user
  end

  def set_beer
    @beer = Beer.find(params[:beer_id])
  end

  def review_params
    params.require(:review).permit(:text, :rating)
  end
end
