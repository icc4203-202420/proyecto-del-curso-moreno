class AttendancesController < ApplicationController
    before_action :authenticate_user!
  
    # Check-in a user to an event
    def create
      event = Event.find(params[:event_id])
      attendance = event.attendances.build(user: current_user)
  
      if attendance.save
        render json: { message: 'Check-in successful' }, status: :created
      else
        render json: { errors: attendance.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    # List users who checked-in for an event
    def index
      event = Event.find(params[:event_id])
      users = event.users
  
      render json: users
    end
  end
  