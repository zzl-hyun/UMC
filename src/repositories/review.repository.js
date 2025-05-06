import { pool, prisma } from "../db.config.js";


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

export const getAllStoreReivews = async (storeId, cursor = 0) => {
  try {
    const reviews = await prisma.userStoreReview.findMany({
      select: {
        id: true,
        content: true,
        store: true,
        user: true,
      },
      where: { 
        storeId: parseInt(storeId), 
        id: { gt: cursor }
      },
      orderBy: { id: "asc" },
      take: 5,
    });
    
    return reviews;
  } catch (error) {
    console.error("Prisma 오류:", error);
    throw new Error(`상점 리뷰 조회 중 오류가 발생했습니다: ${error.message}`);
  }
};