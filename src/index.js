import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import * as userController from "./controllers/user.controller.js";
import * as storeController from "./controllers/store.controller.js";
import * as missionController from "./controllers/mission.controller.js";
import logger, { stream } from "./logger.js";  // stream 추가 임포트
import compression from "compression";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import session from "express-session";
import passport from "passport";
import { googleStrategy, kakaoStrategy } from "./auth/auth.config.js";
import { prisma } from "./db.config.js";

dotenv.config();

passport.use(googleStrategy);
passport.use(kakaoStrategy);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const port = process.env.PORT;
const app = express();

// 응답 압축 미들웨어 설정
app.use(compression({
  threshold: 512,
  level: 6,
  filter: (req, res) => {
    if (res.getHeader('Content-Type')) {
      const contentType = res.getHeader('Content-Type');
      return !/(?:^|,)\s*(?:image\/|audio\/|video\/|application\/zip)/i.test(contentType);
    }
    return compression.filter(req, res);
  }
}));

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use(morgan(':method :url :status :response-time ms - :res[content-length]', { stream }));
app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup({}, {
    swaggerOptions: {
      url: "/openapi.json",
    },
  })
);

/**
 * 세션 설정
 */
app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

BigInt.prototype.toJSON = function() {
  return this.toString();
};

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
  console.log(req.user);
  res.send("Hello World!");
});
app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
  const routes = ["./src/index.js"];
  const doc = {
    info: {
      title: "UMC 7th",
      description: "UMC 7th Node.js 테스트 프로젝트입니다.",
    },
    host: "localhost:3000",
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
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

// OAuth2
// Google OAuth 라우트 추가
app.get("/oauth2/login/google", passport.authenticate("google"));
app.get("/oauth2/google/callback", passport.authenticate("google", {
  failureRedirect: "/oauth2/login/google",
  failureMessage: true,
}), (req, res) => res.redirect("/"));
// Kakao OAuth 라우트 추가
app.get("/oauth2/login/kakao", passport.authenticate("kakao"));
app.get("/oauth2/kakao/callback", passport.authenticate("kakao", {
  failureRedirect: "/oauth2/login/kakao",
  failureMessage: true,
}), (req, res) => res.redirect("/"));

/**
 * 전역 오류를 처리하기 위한 미들웨어
 */
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.log(err);
  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

app.listen(port, () => {
  logger.info(`Example app listening on port ${port}`);
});