import { StatusCodes } from "http-status-codes";
import { bodyToUser, bodyToUpdateProfile } from "../dtos/user.dto.js";
import { userSignUp, updateProfile } from "../services/user.service.js";
import * as reviewService from "../services/review.service.js"
import * as missionService from "../services/mission.service.js";


export const handleUserSignUp = async (req, res, next) => {
  /*
    #swagger.summary = '회원 가입 API';
    #swagger.description = '새로운 사용자를 등록합니다. 이메일, 이름, 선호 카테고리 등의 정보가 필요합니다.';
    #swagger.tags = ['User'];
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: { type: "string", example: "user@example.com", description: "사용자 이메일" },
              name: { type: "string", example: "홍길동", description: "사용자 이름" },
              gender: { type: "string", example: "남성", description: "성별", enum: ["남성", "여성"] },
              birth: { type: "string", format: "date", example: "1990-01-01", description: "생년월일" },
              address: { type: "string", example: "서울시 강남구", description: "주소" },
              detailAddress: { type: "string", example: "역삼동 123-45", description: "상세 주소" },
              phoneNumber: { type: "string", example: "010-1234-5678", description: "전화번호" },
              preferences: { 
                type: "array", 
                items: { type: "number" }, 
                example: [1, 3, 5],
                description: "선호하는 카테고리 ID 목록" 
              }
            },
            required: ["email", "name", "gender", "birth", "preferences"]
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "회원 가입 성공 응답",
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
                  id: { type: "integer", example: 123 },
                  email: { type: "string", example: "user@example.com" },
                  name: { type: "string", example: "홍길동" },
                  preferCategory: { 
                    type: "array", 
                    items: { 
                      type: "object", 
                      properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "한식" }
                      }
                    } 
                  }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "회원 가입 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U001" },
                  reason: { type: "string", example: "이미 존재하는 이메일입니다." },
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
  try{
    console.log("회원가입을 요청했습니다!");
    console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용
    
    const user = await userSignUp(bodyToUser(req.body));
    res.status(StatusCodes.OK).success(user);
  }catch(err){
    next(err);
  }
};


export const handleUpdateProfile = async (req, res, next) => {
  /*
    #swagger.summary = '사용자 프로필 업데이트 API';
    #swagger.description = '로그인한 사용자의 프로필 정보를 업데이트합니다. OAuth 로그인 후 부족한 정보를 채울 때 사용합니다.';
    #swagger.tags = ['User'];
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", example: "홍길동", description: "사용자 이름" },
              gender: { type: "string", example: "남성", description: "성별", enum: ["남성", "여성", "미설정"] },
              birth: { type: "string", format: "date", example: "1990-01-01", description: "생년월일" },
              address: { type: "string", example: "서울시 강남구", description: "주소" },
              detailAddress: { type: "string", example: "역삼동 123-45", description: "상세 주소" },
              phoneNumber: { type: "string", example: "010-1234-5678", description: "전화번호" },
              preferences: { 
                type: "array", 
                items: { type: "number" }, 
                example: [1, 3, 5],
                description: "선호하는 카테고리 ID 목록 (선택사항)" 
              }
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "프로필 업데이트 성공 응답",
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
                  id: { type: "integer", example: 123 },
                  email: { type: "string", example: "user@example.com" },
                  name: { type: "string", example: "홍길동" },
                  gender: { type: "string", example: "남성" },
                  birth: { type: "string", format: "date", example: "1990-01-01" },
                  address: { type: "string", example: "서울시 강남구" },
                  detailAddress: { type: "string", example: "역삼동 123-45" },
                  phoneNumber: { type: "string", example: "010-1234-5678" },
                  preferCategory: { 
                    type: "array", 
                    items: { 
                      type: "object", 
                      properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "한식" }
                      }
                    } 
                  }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[401] = {
      description: "인증 필요",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "UNAUTHORIZED" },
                  reason: { type: "string", example: "로그인이 필요합니다." },
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
      description: "사용자를 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U002" },
                  reason: { type: "string", example: "존재하지 않는 사용자입니다." },
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
    const userId = req.user.id; // 현재 로그인한 사용자 ID
    
    // 프로필 데이터와 선호 카테고리 분리
    const updateData = {
      profileData: bodyToUpdateProfile(req.body),
      preferences: req.body.preferences
    };
    
    const updatedUser = await updateProfile(userId, updateData);
    
    res.status(StatusCodes.OK).success(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const handleListUserReviews = async (req, res, next) => {
  /*
    #swagger.summary = '사용자 리뷰 목록 조회 API';
    #swagger.description = '특정 사용자가 작성한 리뷰 목록을 조회합니다.';
    #swagger.tags = ['User', 'Review'];
    #swagger.parameters['userId'] = {
      in: 'path',
      description: '사용자 ID',
      required: true,
      type: 'integer',
      example: 1
    };
    #swagger.parameters['cursor'] = {
      in: 'query',
      description: '페이지네이션 커서 (다음 페이지 조회 시 이전 응답의 cursor 값 사용)',
      required: false,
      type: 'integer',
      example: 0
    };
    #swagger.responses[200] = {
      description: "사용자 리뷰 목록 조회 성공 응답",
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
                        id: { type: "string", example: "123" },
                        body: { type: "string", example: "맛있는 음식이었습니다." },
                        score: { type: "number", example: 4.5 },
                        userId: { type: "string", example: "1" },
                        storeId: { type: "string", example: "42" },
                        storeName: { type: "string", example: "맛있는 식당" },
                        createdAt: { type: "string", format: "date-time", example: "2025-05-01T12:34:56Z" },
                        updatedAt: { type: "string", format: "date-time", example: "2025-05-01T12:34:56Z" }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      cursor: { type: "integer", nullable: true, example: 456 }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[404] = {
      description: "사용자를 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U002" },
                  reason: { type: "string", example: "사용자를 찾을 수 없습니다." },
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
  try{
    const userId = parseInt(req.params.userId);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;
    
    const result = await reviewService.listUserReviews(userId, cursor);
    
    res.status(StatusCodes.OK).success(result);
  }catch (err){
    next(err);
  }
};

export const handleListUserMissions = async (req, res, next) => {
  /*
    #swagger.summary = '사용자 미션 목록 조회 API';
    #swagger.description = '특정 사용자의 미션 목록을 조회합니다. 상태별 필터링이 가능합니다.';
    #swagger.tags = ['User', 'Mission'];
    #swagger.parameters['userId'] = {
      in: 'path',
      description: '사용자 ID',
      required: true,
      type: 'integer',
      example: 1
    };
    #swagger.parameters['cursor'] = {
      in: 'query',
      description: '페이지네이션 커서 (다음 페이지 조회 시 이전 응답의 cursor 값 사용)',
      required: false,
      type: 'integer',
      example: 0
    };
    #swagger.parameters['status'] = {
      in: 'query',
      description: '미션 상태 필터',
      required: false,
      type: 'string',
      enum: ['진행중', '완료', '포기', '실패'],
      default: '진행중',
      example: '진행중'
    };
    #swagger.responses[200] = {
      description: "미션 목록 조회 성공 응답",
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
                        id: { type: "integer", example: 123 },
                        userId: { type: "integer", example: 1 },
                        missionId: { type: "integer", example: 456 },
                        status: { type: "string", example: "진행중" },
                        storeName: { type: "string", example: "맛있는 식당" },
                        missionSpec: { type: "string", example: "햄버거 메뉴 리뷰 작성하기" },
                        reward: { type: "string", example: "포인트 500점" },
                        deadline: { type: "string", format: "date-time", example: "2025-06-30T23:59:59Z" },
                        createdAt: { type: "string", format: "date-time", example: "2025-05-01T12:34:56Z" },
                        updatedAt: { type: "string", format: "date-time", example: "2025-05-01T12:34:56Z" }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      cursor: { type: "integer", nullable: true, example: 456 }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[404] = {
      description: "사용자를 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U002" },
                  reason: { type: "string", example: "사용자를 찾을 수 없습니다." },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
    #swagger.responses[500] = {
      description: "서버 오류 응답",
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
                  reason: { type: "string", example: "서버 내부 오류가 발생했습니다." },
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
    const userId = parseInt(req.params.userId);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;
    const status = req.query.status || '진행중';
    
    const result = await missionService.listUserMissions(userId, cursor, status);
    
    res.status(StatusCodes.OK).success(result);
  } catch (err) {
    next(err);
  }
};


export const handleChangePassword = async (req, res, next) => {
  /*
    #swagger.summary = '비밀번호 변경 API';
    #swagger.description = '로그인한 사용자의 비밀번호를 변경합니다.';
    #swagger.tags = ['User'];
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              currentPassword: { type: "string", example: "OldPassword123!", description: "현재 비밀번호" },
              newPassword: { type: "string", example: "NewPassword123!", description: "새 비밀번호 (8-50자, 영문 대소문자, 숫자, 특수문자 포함)" },
              confirmPassword: { type: "string", example: "NewPassword123!", description: "새 비밀번호 확인" }
            },
            required: ["currentPassword", "newPassword", "confirmPassword"]
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "비밀번호 변경 성공 응답",
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
                  message: { type: "string", example: "비밀번호가 성공적으로 변경되었습니다." }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "비밀번호 변경 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U003" },
                  reason: { type: "string", example: "현재 비밀번호가 올바르지 않습니다." },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
    #swagger.responses[401] = {
      description: "인증 필요",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "UNAUTHORIZED" },
                  reason: { type: "string", example: "로그인이 필요합니다." },
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
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = bodyToChangePassword(req.body);

    // 새 비밀번호와 확인 비밀번호 일치 확인
    if (newPassword !== confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).error({
        errorCode: "U003",
        reason: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.",
        data: null
      });
    }

    // 새 비밀번호 유효성 검사
    if (!validatePassword(newPassword)) {
      return res.status(StatusCodes.BAD_REQUEST).error({
        errorCode: "U004",
        reason: "새 비밀번호는 8-50자이며, 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.",
        data: null
      });
    }

    await changePassword(userId, currentPassword, newPassword);

    res.status(StatusCodes.OK).success({
      message: "비밀번호가 성공적으로 변경되었습니다."
    });
  } catch (err) {
    next(err);
  }
};