import { StatusCodes } from "http-status-codes";
import * as storeService from '../services/store.service.js';
import * as reviewService from '../services/review.service.js';
import * as missionService from '../services/mission.service.js';
import { bodyToStore } from '../dtos/store.dto.js';
import { bodyToReview } from '../dtos/reiveiw.dto.js';
import { bodyToMission } from '../dtos/mission.dto.js';

export const createStore = async(req, res, next) => {
    /*
    #swagger.summary = '가게 생성 API';
    #swagger.description = '특정 지역에 새로운 가게를 생성합니다.';
    #swagger.tags = ['Store'];
    #swagger.parameters['regionId'] = {
      in: 'path',
      description: '지역 ID',
      required: true,
      type: 'integer'
    };
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", description: "가게 이름", example: "맛있는 식당" },
              address: { type: "string", description: "가게 주소", example: "서울시 강남구 역삼동 123-45" },
              score: { type: "number", description: "가게 평점", example: 4.5 }
            }
          }
        }
      }
    };
    #swagger.responses[201] = {
      description: "가게 생성 성공 응답",
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
                  id: { type: "string" },
                  name: { type: "string" },
                  address: { type: "string" },
                  score: { type: "number" },
                  regionId: { type: "string" },
                  createdAt: { type: "string", format: "date-time" },
                  updatedAt: { type: "string", format: "date-time" }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "잘못된 요청",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string" },
                  reason: { type: "string", example: "이미 존재하는 상점입니다." },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
    */
    try {
        const regionId = parseInt(req.params.regionId);
        const store = await storeService.createStore(regionId, bodyToStore(req.body));

        res.status(StatusCodes.CREATED).success(store);
        
    } catch (err) {
        next(err);
    }
};

export const createReview = async (req, res, next) => {
    /*
    #swagger.summary = '리뷰 작성 API';
    #swagger.description = '특정 가게에 대한 리뷰를 작성합니다.';
    #swagger.tags = ['Review', 'Store'];
    #swagger.parameters['storeId'] = {
      in: 'path',
      description: '가게 ID',
      required: true,
      type: 'integer'
    };
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userId: { type: "integer", description: "사용자 ID" },
              body: { type: "string", description: "리뷰 내용" },
              score: { type: "number", description: "평점 (1~5)" }
            },
            required: ["userId", "body", "score"]
          }
        }
      }
    };
    #swagger.responses[201] = {
      description: "리뷰 작성 성공 응답",
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
                  id: { type: "string" },
                  body: { type: "string" },
                  score: { type: "number" },
                  userId: { type: "string" },
                  storeId: { type: "string" },
                  createdAt: { type: "string", format: "date-time" },
                  updatedAt: { type: "string", format: "date-time" }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[404] = {
      description: "가게를 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string" },
                  reason: { type: "string", example: "가게가 없습니다." },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
    */
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
    /*
    #swagger.summary = '미션 생성 API';
    #swagger.description = '특정 가게에 새로운 미션을 생성합니다.';
    #swagger.tags = ['Mission', 'Store'];
    #swagger.parameters['storeId'] = {
      in: 'path',
      description: '가게 ID',
      required: true,
      type: 'integer'
    };
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              reward: { type: "string", description: "미션 보상", example: "포인트 500점" },
              deadline: { type: "string", format: "date-time", description: "미션 마감일" },
              missionSpec: { type: "string", description: "미션 내용", example: "햄버거 메뉴 리뷰 작성하기" }
            },
            required: ["reward", "deadline", "missionSpec"]
          }
        }
      }
    };
    #swagger.responses[201] = {
      description: "미션 생성 성공 응답",
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
                  id: { type: "integer" },
                  storeId: { type: "integer" },
                  storeName: { type: "string" },
                  reward: { type: "string" },
                  deadline: { type: "string", format: "date-time" },
                  missionSpec: { type: "string" },
                  createdAt: { type: "string", format: "date-time" },
                  updatedAt: { type: "string", format: "date-time" }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[404] = {
      description: "가게를 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "S001" },
                  reason: { type: "string", example: "존재하지 않는 가게입니다." },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
    */
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
    #swagger.summary = '가게 리뷰 목록 조회 API';
    #swagger.description = '특정 가게에 작성된 모든 리뷰를 조회합니다.';
    #swagger.tags = ['Review', 'Store'];
    #swagger.parameters['storeId'] = {
      in: 'path',
      description: '가게 ID',
      required: true,
      type: 'integer'
    };
    #swagger.parameters['cursor'] = {
      in: 'query',
      description: '페이지네이션 커서',
      required: false,
      type: 'integer'
    };
    #swagger.responses[200] = {
      description: "가게 리뷰 목록 조회 성공 응답",
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
                        id: { type: "string" },
                        body: { type: "string" },
                        score: { type: "number" },
                        userId: { type: "string" },
                        storeId: { type: "string" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      cursor: { type: "string", nullable: true }
                    }
                  }
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
  /*
    #swagger.summary = '가게별 미션 목록 조회 API';
    #swagger.description = '특정 가게의 미션 목록을 조회합니다.';
    #swagger.tags = ['Mission', 'Store'];
    #swagger.parameters['storeId'] = {
      in: 'path',
      description: '가게 ID',
      required: true,
      type: 'integer'
    };
    #swagger.parameters['cursor'] = {
      in: 'query',
      description: '페이지네이션 커서',
      required: false,
      type: 'integer'
    };
    #swagger.responses[200] = {
      description: "가게 미션 목록 조회 성공 응답",
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
                        id: { type: "integer" },
                        storeId: { type: "integer" },
                        storeName: { type: "string" },
                        reward: { type: "string" },
                        deadline: { type: "string", format: "date-time" },
                        missionSpec: { type: "string" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      cursor: { type: "integer", nullable: true }
                    }
                  }
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
    
    const result = await missionService.listStoreMissions(storeId, cursor);
    
    res.status(StatusCodes.OK).success(result);
  } catch (err) {
    next(err);
  }
};