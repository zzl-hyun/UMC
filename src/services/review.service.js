import { addReview, getReviewById } from "../repositories/review.repository.js";
import { getStoreById } from "../repositories/store.repository.js";
import { responseFromSingleReview } from "../dtos/reiveiw.dto.js";

export const createReview = async (storeId, reviewData) => {
  
  const store = await getStoreById(storeId);
  if(!store) throw new Error("가게가 없습니다.");
  
  // 리뷰 추가
  const reviewId = await addReview({
    storeId,
    userId: reviewData.userId,
    body: reviewData.body,
    score: reviewData.score
  });
  
  // 생성된 리뷰 정보 조회
  const review = await getReviewById(reviewId);
  
  return responseFromSingleReview(review);
};