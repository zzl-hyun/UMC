import { addReview, addReviewImage, getReviewById } from "../repositories/review.repository.js";
import { getStoreById } from "../repositories/store.repository.js";
import { responseFromReview } from "../dtos/reivew.dto.js";

export const createReview = async (storeId, reviewData) => {
  // 상점이 존재하는지 확인
  await getStoreById(storeId);
  
  // 리뷰 추가
  const reviewId = await addReview({
    storeId,
    userId: reviewData.userId,
    body: reviewData.body,
    score: reviewData.score
  });
  
  // 이미지가 있다면 이미지 추가
  if (reviewData.imageUrl) {
    await addReviewImage(reviewId, storeId, reviewData.imageUrl);
  }
  
  // 생성된 리뷰 정보 조회
  const review = await getReviewById(reviewId);
  
  return responseFromReview(review);
};