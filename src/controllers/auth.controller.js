import { StatusCodes } from "http-status-codes";
import passport from "passport";
import { bodyToLogin, bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handleLocalSignUp = async (req, res, next) => {
  /*
    #swagger.summary = '이메일 회원가입 API';
    #swagger.description = '이메일과 비밀번호를 사용하여 새로운 사용자를 등록합니다.';
    #swagger.tags = ['Auth'];
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: { type: "string", example: "user@example.com", description: "사용자 이메일" },
              password: { type: "string", example: "Password123!", description: "비밀번호 (8-50자, 영문 대소문자, 숫자, 특수문자 포함)" },
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
            required: ["email", "password", "name", "gender", "birth", "preferences"]
          }
        }
      }
    };
    #swagger.responses[201] = {
      description: "회원가입 성공 응답",
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
                    items: { type: "string" }, 
                    example: ["한식", "중식", "일식"]
                  }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "회원가입 실패 응답",
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
  try {
    console.log("이메일 회원가입을 요청했습니다!");
    console.log("body:", req.body);
    
    const user = await userSignUp(bodyToUser(req.body));
    res.status(StatusCodes.CREATED).success(user);
  } catch (err) {
    next(err);
  }
};

export const handleLocalLogin = async (req, res, next) => {
  /*
    #swagger.summary = '이메일 로그인 API';
    #swagger.description = '이메일과 비밀번호를 사용하여 로그인합니다.';
    #swagger.tags = ['Auth'];
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: { type: "string", example: "user@example.com", description: "사용자 이메일" },
              password: { type: "string", example: "Password123!", description: "비밀번호" }
            },
            required: ["email", "password"]
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "로그인 성공 응답",
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
                  user: {
                    type: "object",
                    properties: {
                      id: { type: "integer", example: 123 },
                      email: { type: "string", example: "user@example.com" },
                      name: { type: "string", example: "홍길동" },
                      loginType: { type: "string", example: "LOCAL" }
                    }
                  },
                  message: { type: "string", example: "로그인 성공" }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[401] = {
      description: "로그인 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "AUTH001" },
                  reason: { type: "string", example: "이메일 또는 비밀번호가 올바르지 않습니다." },
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
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).error({
        errorCode: "AUTH001",
        reason: info?.message || "이메일 또는 비밀번호가 올바르지 않습니다.",
        data: null
      });
    }
    
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      
      console.log("로그인 성공:", user);
      
      return res.status(StatusCodes.OK).success({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          loginType: user.loginType
        },
        message: "로그인 성공"
      });
    });
  })(req, res, next);
};

export const handleLogout = async (req, res, next) => {
  /*
    #swagger.summary = '로그아웃 API';
    #swagger.description = '현재 로그인된 사용자를 로그아웃합니다.';
    #swagger.tags = ['Auth'];
    #swagger.responses[200] = {
      description: "로그아웃 성공 응답",
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
                  message: { type: "string", example: "로그아웃 성공" }
                }
              }
            }
          }
        }
      }
    };
  */
  req.logout((err) => {
    if (err) {
      return res.status(500).error({
        errorCode: "LOGOUT_FAILED",
        reason: "로그아웃 중 오류가 발생했습니다.",
        data: err
      });
    }
    res.status(StatusCodes.OK).success({
      message: "로그아웃 성공"
    });
  });
};

export const handleGetCurrentUser = async (req, res, next) => {
  /*
    #swagger.summary = '현재 사용자 정보 조회 API';
    #swagger.description = '현재 로그인된 사용자의 정보를 조회합니다.';
    #swagger.tags = ['Auth'];
    #swagger.responses[200] = {
      description: "사용자 정보 조회 성공",
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
                  loginType: { type: "string", example: "LOCAL" }
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
  */
  if (req.user) {
    res.status(StatusCodes.OK).success(req.user);
  } else {
    res.status(StatusCodes.UNAUTHORIZED).error({
      errorCode: "UNAUTHORIZED",
      reason: "로그인이 필요합니다.",
      data: null
    });
  }
};