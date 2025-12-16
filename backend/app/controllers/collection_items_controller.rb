# This controller manages CRUD operations for collection items associated with the authenticated user
class CollectionItemsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_collection_item, only: %i[ show update destroy ]

  # GET /collection_items
  def index
    @collection_items = current_user.collection_items
    render json: @collection_items
  end

  # GET /collection_items/1
  def show
    render json: @collection_item
  end

  # POST /collection_items
  def create
    # Strong params protect against mass assignment vulnerabilities
    @collection_item = current_user.collection_items.new(collection_item_params)

    if @collection_item.save
      render json: @collection_item, status: :created
    else
      render json: { errors: @collection_item.errors }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /collection_items/1
  def update
    if @collection_item.update(collection_item_params)
      render json: @collection_item
    else
      render json: { errors: @collection_item.errors }, status: :unprocessable_entity
    end
  end

  # DELETE /collection_items/1
  def destroy
    @collection_item.destroy!
    head :no_content
  end

  private

  def set_collection_item
    # Use standard params and coerce to integer for hygiene.
    @collection_item = CollectionItem.find(params[:id].to_i)
  end

  def collection_item_params
    # require(:collection_item) ensures payload is properly nested
    # permit(...) whitelists allowed fields to protect against mass assignment
    params.require(:collection_item).permit(
      :tmdb_id,
      :title,
      :poster_path,
      :release_date,
      :vote_average,
      :overview
    )
  end
end
