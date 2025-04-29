import * as storeService from '../services/store.service';
import * as reviewService from '../services/review.service'
import * as missionService from '../services/mission.service'
import { bodyToStore } from '../dtos/store.dto';
import { bodyToReview } from '../dtos/reivew.dto';
import { bodyToMission } from '../dtos/mission.dto';
import  *  as dtos from '../dtos/';
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
            
      // 리뷰 추가
      const review = await reviewService.createReview(storeId, bodyToReview(req.body));
      
      res.status(StatusCodes.CREATED).json({
        status: 'success',
        message: '리뷰가 성공적으로 추가되었습니다.',
        data: review
      });
    } catch (err) {
        next(err);
    }
  };

  export const createMission = async (req, res) => {
    try{
      const storeId = req.params.storeId;

      const mission = await missionService.createMission(storeId, bodyToMission(req.body));

      res.status(StatusCodes.CREATED).json({
        status: 'success',
        message: '미션이 성공적으로 추가되었습니다.',
        data: mission
      });
    } catch (err){
      next(err);
    }
  };