import { StatusCodes } from "http-status-codes";
import * as storeService from '../services/store.service.js';
import * as reviewService from '../services/review.service.js';
import * as missionService from '../services/mission.service.js';
import { bodyToStore } from '../dtos/store.dto.js';
import { bodyToReview, responseFromReview } from '../dtos/reivew.dto.js';
import { bodyToMission } from '../dtos/mission.dto.js';

export const createStore = async(req, res, next) => {
    try {
        const regionId = req.params.regionId;
        const store = await storeService.createStore(regionId, bodyToStore(req.body));

        res.status(StatusCodes.CREATED).json({ 
            status: 'success',
            message: '상점이 성공적으로 추가되었습니다.',
            data: store 
        });
        
    } catch (err) {
        next(err);
    }
};

export const createReview = async (req, res, next) => {
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

export const createMission = async (req, res, next) => {
    try {
        const storeId = req.params.storeId;

        const mission = await missionService.createMission(storeId, bodyToMission(req.body));

        res.status(StatusCodes.CREATED).json({
            status: 'success',
            message: '미션이 성공적으로 추가되었습니다.',
            data: mission
        });
    } catch (err) {
        next(err);
    }
};

export const handleListStoreReviews = async (req, res, next) => {
    try{
        const reviews = await storeService.listStoreReivews(
            parseInt(req.params.storeId),
            typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
        );
        
        res.status(StatusCodes.OK).json(reviews);
    } catch (err){
        next(err);
    }
}