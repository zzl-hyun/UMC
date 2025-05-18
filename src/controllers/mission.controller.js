import { StatusCodes } from "http-status-codes";
import * as missionService from '../services/mission.service.js';
import { bodyToChallengeMission } from '../dtos/mission.dto.js';


export const challengeMission = async (req, res, next) => {
  /*
    #swagger.summary = '미션 도전 API';
    #swagger.description = '특정 미션에 도전합니다. 사용자가 미션을 수행하기 시작할 때 호출합니다.';
    #swagger.tags = ['Mission'];
    #swagger.parameters['missionId'] = {
      in: 'path',
      description: '도전할 미션 ID',
      required: true,
      type: 'integer',
      example: 123
    };
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userId: { 
                type: "integer", 
                description: "미션에 도전할 사용자 ID", 
                example: 1 
              }
            },
            required: ["userId"]
          }
        }
      }
    };
    #swagger.responses[201] = {
      description: "미션 도전 성공 응답",
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
                  id: { type: "integer", example: 456 },
                  userId: { type: "integer", example: 1 },
                  missionId: { type: "integer", example: 123 },
                  status: { type: "string", example: "진행중" },
                  storeName: { type: "string", example: "맛있는 식당" },
                  missionSpec: { type: "string", example: "햄버거 메뉴 리뷰 작성하기" },
                  reward: { type: "string", example: "포인트 500점" },
                  deadline: { type: "string", format: "date-time", example: "2025-06-30T23:59:59Z" },
                  createdAt: { type: "string", format: "date-time", example: "2025-05-19T10:15:30Z" },
                  updatedAt: { type: "string", format: "date-time", example: "2025-05-19T10:15:30Z" }
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
                  errorCode: { type: "string", example: "M002" },
                  reason: { type: "string", example: "이미 참여한 미션입니다." },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
    #swagger.responses[404] = {
      description: "미션을 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "M003" },
                  reason: { type: "string", example: "존재하지 않는 미션입니다." },
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
    const missionId = req.params.missionId;
    
    // 미션 도전하기
    const userMission = await missionService.challengeMission(missionId, bodyToChallengeMission(req.body));
    
    res.status(StatusCodes.CREATED).success(userMission);
  } catch (err) {
    next(err);
  }
};


// 미션 상태 업데이트
export const UpdateMissionStatus = async (req, res, next) => {
  /*
    #swagger.summary = '미션 상태 업데이트 API';
    #swagger.description = '특정 미션의 상태를 업데이트합니다.';
    #swagger.tags = ['Mission'];
    #swagger.parameters['userMissionId'] = {
      in: 'path',
      description: '사용자 미션 ID',
      required: true,
      type: 'integer',
      example: 456
    };
    #swagger.parameters['status'] = {
      in: 'query',
      description: '변경할 미션 상태',
      required: false,
      type: 'string',
      enum: ['진행중', '완료', '포기', '실패'],
      default: '완료',
      example: '완료'
    };
    #swagger.responses[200] = {
      description: "미션 상태 업데이트 성공 응답",
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
                  id: { type: "integer", example: 456 },
                  userId: { type: "integer", example: 1 },
                  missionId: { type: "integer", example: 123 },
                  status: { type: "string", example: "완료" },
                  storeName: { type: "string", example: "맛있는 식당" },
                  missionSpec: { type: "string", example: "햄버거 메뉴 리뷰 작성하기" },
                  reward: { type: "string", example: "포인트 500점" },
                  deadline: { type: "string", format: "date-time", example: "2025-06-30T23:59:59Z" },
                  createdAt: { type: "string", format: "date-time", example: "2025-05-19T10:15:30Z" },
                  updatedAt: { type: "string", format: "date-time", example: "2025-05-19T10:15:40Z" }
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
                  errorCode: { type: "string", example: "M001" },
                  reason: { type: "string", example: "이미 '완료' 상태인 미션입니다." },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
    #swagger.responses[404] = {
      description: "미션을 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "M003" },
                  reason: { type: "string", example: "존재하지 않는 미션 참여 정보입니다." },
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
    const userMissionId = parseInt(req.params.userMissionId);
    const status = req.query.status || '완료';
    
    const result = await missionService.updateMissionStatus(userMissionId, status);
    
    res.status(StatusCodes.OK).success(result);
  } catch (err) {
    next(err);
  }
};