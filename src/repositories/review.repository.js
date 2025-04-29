import { pool } from "../db.config";

export const createReview = async (userId, storeId, reviewData) => {
    const conn = await pool.getConnection();

    try{
        await conn.beginTransaction();

        const [reviewResult] = await conn.query(
            `INSERT INTO review (member_id, store_id, body, score, created_at) 
             VALUES (?, ?, ?, ?, NOW());`,
            [memberId, storeId, reviewData.body, reviewData.score]
          );

        const reviewId = reviewResult.insertId;

        if (reviewData.imageUrl) {
            await conn.query(
              `INSERT INTO review_image (review_id, store_id, image_url, created_at, updated_at) 
               VALUES (?, ?, ?, NOW(), NOW());`,
              [reviewId, storeId, reviewData.imageUrl]
            );
          }
        
          await conn.commit();

          return reviewId;
    } catch (err){
        await conn.rollback();
        throw new Error(`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`);
    } finally{
        conn.release();
    }
};

export const getReviewById = async (reviewId) => {
    const conn = await pool.getConnection();
    
    try {
      const [rows] = await pool.query(
        `SELECT r.*, ri.image_url 
         FROM review r
         LEFT JOIN review_image ri ON r.id = ri.review_id
         WHERE r.id = ?;`,
        [reviewId]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      throw new Error(`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`);
    } finally {
      conn.release();
    }
  };