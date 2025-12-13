class CollectionItemsController < ApplicationController
  before_action :set_collection_item, only: %i[ show update destroy ]

  # GET /collection_items
  def index
    @collection_items = CollectionItem.all

    render json: @collection_items
  end

  # GET /collection_items/1
  def show
    render json: @collection_item
  end

  # POST /collection_items
  def create
    @collection_item = CollectionItem.new(collection_item_params)

    if @collection_item.save
      render json: @collection_item, status: :created, location: @collection_item
    else
      render json: @collection_item.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /collection_items/1
  def update
    if @collection_item.update(collection_item_params)
      render json: @collection_item
    else
      render json: @collection_item.errors, status: :unprocessable_content
    end
  end

  # DELETE /collection_items/1
  def destroy
    @collection_item.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_collection_item
      @collection_item = CollectionItem.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def collection_item_params
      params.expect(collection_item: [ :tmdb_id, :title, :poster_path, :release_date, :vote_average ])
    end
end
