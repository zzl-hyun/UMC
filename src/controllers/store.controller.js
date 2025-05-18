import { StatusCodes } from "http-status-codes";
import * as storeService from '../services/store.service.js';
import * as reviewService from '../services/review.service.js';
import * as missionService from '../services/mission.service.js';
import { bodyToStore } from '../dtos/store.dto.js';
import { bodyToReview } from '../dtos/reiveiw.dto.js';
import { bodyToMission } from '../dtos/mission.dto.js';

export const createStore = async(req, res, next) => {
    try {
        const regionId = parseInt(req.params.regionId);
        const store = await storeService.createStore(regionId, bodyToStore(req.body));

        res.status(StatusCodes.CREATED).success(store);
        
    } catch (err) {
        next(err);
    }
};

export const createReview = async (req, res, next) => {
    try {
        const storeId = parseInt(req.params.storeId);
        
        // 리뷰 추가
        const review = await reviewService.createReview(storeId, bodyToReview(req.body));
        
        res.status(StatusCodes.CREATED).success(review);
    } catch (err) {
        next(err);
    }
};

export const createMission = async (req, res, next) => {
    try {
        const storeId = parseInt(req.params.storeId);

        const mission = await missionService.createMission(storeId, bodyToMission(req.body));

        res.status(StatusCodes.CREATED).success(mission);
    } catch (err) {
        next(err);
    }
};


export const handleListStoreReviews = async (req, res, next) => {
      /*
    #swagger.summary = '상점 리뷰 목록 조회 API';
    #swagger.responses[200] = {
      description: "상점 리뷰 목록 조회 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        store: { type: "object", properties: { id: { type: "number" }, name: { type: "string" } } },
                        user: { type: "object", properties: { id: { type: "number" }, email: { type: "string" }, name: { type: "string" } } },
                        content: { type: "string" }
                      }
                    }
                  },
                  pagination: { type: "object", properties: { cursor: { type: "number", nullable: true } }}
                }
              }
            }
          }
        }
      }
    };
  */
    try {
        const storeId = parseInt(req.params.storeId);
        const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;
        
        const result = await storeService.listStoreReviews(storeId, cursor);
        
        res.status(StatusCodes.OK).success(result);
    } catch (err) {
        next(err);
    }
}

export const handleListStoreMissions = async (req, res, next) => {
    try {
        const storeId = parseInt(req.params.storeId);
        const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;
        
        const result = await missionService.listStoreMissions(storeId, cursor);
        
        res.status(StatusCodes.OK).success(result);
    } catch (err) {
        next(err);
    }
};