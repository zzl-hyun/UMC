import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import * as userController from "./controllers/user.controller.js";
import * as storeController from "./controllers/store.controller.js";
import * as missionController from "./controllers/mission.controller.js";
import logger, { stream } from "./logger.js";  // stream 추가 임포트

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use(morgan(':method :url :status :response-time ms - :res[content-length]', { stream }));

/**
 * 공통 응답을 사용할 수 있는 헬퍼 함수 등록
 */
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 사용자 관련
app.post("/api/users/signup", userController.handleUserSignUp);
app.get("/api/users/:userId/reviews", userController.handleListUserReviews);
app.get("/api/users/:userId/missions", userController.handleListUserMissions); 
// 지역 및 상점 관련
app.post("/api/regions/:regionId/stores", storeController.createStore);
// 리뷰 관련
app.post("/api/stores/:storeId/reviews", storeController.createReview);
app.get("/api/stores/:storeId/reviews", storeController.handleListStoreReviews);
// 미션 관련
app.post("/api/stores/:storeId/missions", storeController.createMission);
app.post("/api/missions/:missionId/challenge", missionController.challengeMission);
app.get("/api/stores/:storeId/missions", storeController.handleListStoreMissions);
app.patch("/api/missions/:userMissionId/status", missionController.UpdateMissionStatus); 

/**
 * 전역 오류를 처리하기 위한 미들웨어
 */
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

app.listen(port, () => {
  logger.info(`Example app listening on port ${port}`);
});