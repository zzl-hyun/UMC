import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import * as userController from "./controllers/user.controller.js";
import * as storeController from "./controllers/store.controller.js";
import * as missionController from "./controllers/mission.controller.js";
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use(morgan('dev'));


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

app.use((err, req, res, next) => {
  console.error(err);  // 로그 남기기
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
      status
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});