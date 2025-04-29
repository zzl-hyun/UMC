import * as storeService from '../services/store.service';
import { bodyToStore } from '../dtos/store.dto';
import { StatusCodes } from "http-status-codes";

export const createStore = async(req, res) => {
    try{
        const regionId = req.params.regionId;

        const store = await storeService.createStore(regionId, bodyToStore(req.body));

        res.status(StatusCodes.CREATED).json({ result: store });
        
    } catch (err){
        next(err);
    }
};

export const createReview = async (req, res) => {
    try {
      const storeId = req.params.storeId;
      const reviewDTO = new CreateReviewDTO(req.body);
      
      // 입력 데이터 검증
      reviewDTO.validate();
      
      // 리뷰 추가
      const review = await reviewService.addReview(storeId, reviewDTO);
      
      res.status(StatusCodes.CREATED).json({
        status: 'success',
        message: '리뷰가 성공적으로 추가되었습니다.',
        data: review
      });
    } catch (err) {
        next(err);
    }
  };