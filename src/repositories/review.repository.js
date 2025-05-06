import { prisma } from "../db.config.js";


// 리뷰 추가
export const addReview = async (data) => {  
  try {
    const review = await prisma.review.create({
      data: {
        user_id: data.userId,
        store_id: data.storeId,
        body: data.body,
        score: data.score,
        created_at: new Date()
      }
    });
    
    return review.id;

  } catch (err) {
    throw new Error(`리뷰 추가 중 오류가 발생했습니다: ${err.message}`);
  } 
};

// 리뷰 조회
export const getReviewById = async (reviewId) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        review_image: true,
        user: true,
        store: true
      }
    });
    
    if (!review) {
      throw new Error("존재하지 않는 리뷰입니다.");
    }
    
    
    return review;
  } catch (err) {
    throw new Error(`리뷰 조회 중 오류가 발생했습니다: ${err.message}`);
  }
};

// 가게의 리뷰 목록 조회
export const getAllStoreReviews = async (storeId, cursor = 0) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { 
        store_id: parseInt(storeId),
        id: { gt: parseInt(cursor) }
      },
      include: {
        user: true,
        store: true,
        review_image: true
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

// 사용자가 작성한 리뷰 목록 조회
export const getUserReviews = async (userId, cursor = 0) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { 
        user_id: BigInt(userId),
        ...(cursor > 0 && { id: { gt: BigInt(cursor) } })
      },
      include: {
        store: true,
        review_image: true
      },
      orderBy: { created_at: 'desc' },
      take: 10,
    });
    
    return reviews;
  } catch (error) {
    console.error("사용자 리뷰 조회 오류:", error);
    throw new Error(`사용자 리뷰 조회 중 오류가 발생했습니다: ${error.message}`);
  }
};