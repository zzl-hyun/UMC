import * as reviewRepository from '../repositories/review.repository.js';
import * as storeRepository from '../repositories/store.repository.js';

export const createReview = async (storeId, reviewData) => {
  // 가게가 존재하는지 확인
  const store = await storeRepository.getStoreById(storeId);
  
  if (!store) {
    throw new Error('존재하지 않는 가게입니다.');
  }
  
  // 리뷰 추가
  const reviewId = await reviewRepository.addReview(reviewData.memberId, storeId, reviewData);
  
  // 생성된 리뷰 정보 조회
  const review = await reviewRepository.getReviewById(reviewId);
  
  return review;
};