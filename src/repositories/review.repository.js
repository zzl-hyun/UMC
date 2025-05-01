import { pool } from "../db.config.js";

// 리뷰 추가
export const addReview = async (data) => {
  const conn = await pool.getConnection();
  
  try {
    const [result] = await pool.query(
      `INSERT INTO review (user_id, store_id, body, score, created_at) 
       VALUES (?, ?, ?, ?, NOW());`,
      [data.userId, data.storeId, data.body, data.score]
    );
    
    return result.insertId;
  } catch (err) {
    throw new Error(`리뷰 추가 중 오류가 발생했습니다: ${err.message}`);
  } finally {
    conn.release();
  }
};

// 리뷰 이미지 추가
export const addReviewImage = async (reviewId, storeId, imageUrl) => {
  const conn = await pool.getConnection();
  
  try {
    await pool.query(
      `INSERT INTO review_image (review_id, store_id, image_url, created_at) 
       VALUES (?, ?, ?, NOW());`,
      [reviewId, storeId, imageUrl]
    );
  } catch (err) {
    throw new Error(`리뷰 이미지 추가 중 오류가 발생했습니다: ${err.message}`);
  } finally {
    conn.release();
  }
};

// 리뷰 조회
export const getReviewById = async (reviewId) => {
  const conn = await pool.getConnection();
  
  try {
    const [reviews] = await pool.query(
      `SELECT r.*, COALESCE(ri.image_url, NULL) as image_url 
       FROM review r 
       LEFT JOIN review_image ri ON r.id = ri.review_id 
       WHERE r.id = ?;`,
      [reviewId]
    );
    
    if (reviews.length === 0) {
      throw new Error("존재하지 않는 리뷰입니다.");
    }
    
    return reviews[0];
  } catch (err) {
    throw new Error(`리뷰 조회 중 오류가 발생했습니다: ${err.message}`);
  } finally {
    conn.release();
  }
};