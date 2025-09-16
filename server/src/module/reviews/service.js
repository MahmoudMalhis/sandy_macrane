import db, { fn } from "../../db/knex.js";

class ReviewsService {
  // Create new review
  static async create(reviewData) {
    try {
      const {
        author_name,
        rating,
        text,
        attached_image = null,
        linked_album_id = null,
      } = reviewData;

      const [reviewId] = await db("reviews").insert({
        author_name,
        rating,
        text,
        attached_image,
        linked_album_id,
        status: "pending", // Always pending for manual approval
        created_at: fn.now(),
      });

      return await this.getById(reviewId);
    } catch (error) {
      throw error;
    }
  }

  // Get all reviews (with filters)
  static async getAll(filters = {}) {
    try {
      const {
        status = "published",
        linked_album_id,
        page = 1,
        limit = 12,
        includeAlbumInfo = true,
      } = filters;

      let query = db("reviews");

      if (includeAlbumInfo) {
        query = query
          .select(
            "reviews.*",
            "albums.title as album_title",
            "albums.slug as album_slug"
          )
          .leftJoin("albums", "reviews.linked_album_id", "albums.id");
      }

      // Apply filters
      if (status) {
        query = query.where("reviews.status", status);
      }

      if (linked_album_id) {
        query = query.where("reviews.linked_album_id", linked_album_id);
      }

      // Sorting
      query = query.orderBy("reviews.created_at", "desc");

      // Pagination
      const offset = (page - 1) * limit;
      const reviews = await query.limit(limit).offset(offset);

      // Get total count
      const totalQuery = db("reviews");
      if (status) totalQuery.where("status", status);
      if (linked_album_id) totalQuery.where("linked_album_id", linked_album_id);

      const [{ count }] = await totalQuery.count("* as count");

      return {
        reviews,
        pagination: {
          total: parseInt(count),
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Get review by ID
  static async getById(id) {
    try {
      const review = await db("reviews")
        .select(
          "reviews.*",
          "albums.title as album_title",
          "albums.slug as album_slug"
        )
        .leftJoin("albums", "reviews.linked_album_id", "albums.id")
        .where("reviews.id", id)
        .first();

      if (!review) {
        throw new Error("Review not found");
      }

      return review;
    } catch (error) {
      throw error;
    }
  }

  // Update review
  static async update(id, updateData) {
    try {
      await this.getById(id); // Check if exists

      const {
        author_name,
        rating,
        text,
        attached_image,
        linked_album_id,
        status,
      } = updateData;

      let updates = {};

      if (author_name !== undefined) updates.author_name = author_name;
      if (rating !== undefined) updates.rating = rating;
      if (text !== undefined) updates.text = text;
      if (attached_image !== undefined) updates.attached_image = attached_image;
      if (linked_album_id !== undefined)
        updates.linked_album_id = linked_album_id;
      if (status !== undefined) updates.status = status;

      if (Object.keys(updates).length > 0) {
        await db("reviews").where("id", id).update(updates);
      }

      return await this.getById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete review
  static async delete(id) {
    try {
      const review = await this.getById(id);

      await db("reviews").where("id", id).del();

      return review;
    } catch (error) {
      throw error;
    }
  }

  // Change review status (publish/hide/pending)
  static async changeStatus(id, status) {
    try {
      return await this.update(id, { status });
    } catch (error) {
      throw error;
    }
  }

  // Get featured reviews for homepage
  static async getFeatured(limit = 3) {
    try {
      const reviews = await db("reviews")
        .select(
          "reviews.*",
          "albums.title as album_title",
          "albums.slug as album_slug"
        )
        .leftJoin("albums", "reviews.linked_album_id", "albums.id")
        .where("reviews.status", "published")
        .where("reviews.rating", ">=", 4) // Only high ratings for featured
        .orderBy("reviews.created_at", "desc")
        .limit(limit);

      return reviews;
    } catch (error) {
      throw error;
    }
  }

  // Get reviews statistics
  static async getStats() {
    try {
      const [totalReviews] = await db("reviews").count("* as count");
      const [publishedReviews] = await db("reviews")
        .where("status", "published")
        .count("* as count");
      const [pendingReviews] = await db("reviews")
        .where("status", "pending")
        .count("* as count");
      const [hiddenReviews] = await db("reviews")
        .where("status", "hidden")
        .count("* as count");

      // Get average rating
      const [{ avg_rating }] = await db("reviews")
        .where("status", "published")
        .avg("rating as avg_rating");

      // Get ratings distribution
      const ratingsDistribution = await db("reviews")
        .select("rating")
        .count("* as count")
        .where("status", "published")
        .groupBy("rating")
        .orderBy("rating", "desc");

      const ratingsMap = {};
      ratingsDistribution.forEach((item) => {
        ratingsMap[item.rating] = parseInt(item.count);
      });

      // Ensure all ratings (1-5) are present
      for (let i = 1; i <= 5; i++) {
        if (!ratingsMap[i]) ratingsMap[i] = 0;
      }

      return {
        total: parseInt(totalReviews.count),
        published: parseInt(publishedReviews.count),
        pending: parseInt(pendingReviews.count),
        hidden: parseInt(hiddenReviews.count),
        averageRating: parseFloat(avg_rating) || 0,
        ratingsDistribution: ratingsMap,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get reviews for specific album
  static async getByAlbum(albumId, status = "published") {
    try {
      return await db("reviews")
        .where("linked_album_id", albumId)
        .where("status", status)
        .orderBy("created_at", "desc");
    } catch (error) {
      throw error;
    }
  }
}

// إضافة هذه السطور في نهاية ملف server/src/module/reviews/service.js

// Export named functions
export const create = ReviewsService.create.bind(ReviewsService);
export const getAll = ReviewsService.getAll.bind(ReviewsService);
export const getById = ReviewsService.getById.bind(ReviewsService);
export const update = ReviewsService.update.bind(ReviewsService);
export const changeStatus = ReviewsService.changeStatus.bind(ReviewsService);
export const getFeatured = ReviewsService.getFeatured.bind(ReviewsService);
export const getStats = ReviewsService.getStats.bind(ReviewsService);
export const getByAlbum = ReviewsService.getByAlbum.bind(ReviewsService);

// Export delete with alternative name
export const deleteReview = ReviewsService.delete.bind(ReviewsService);
export { ReviewsService as delete };

export default ReviewsService;
