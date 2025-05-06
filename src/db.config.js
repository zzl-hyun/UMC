import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import logger from './logger.js';

dotenv.config();

export const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

// 쿼리 실행 시간 측정을 위한 미들웨어 추가
prisma.$use(async (params, next) => {
  const model = params.model;
  const action = params.action;
  const startTime = performance.now();
  
  // 쿼리 실행
  const result = await next(params);
  
  const endTime = performance.now();
  const duration = Math.round(endTime - startTime);
  
  // Winston을 사용한 로깅
  logger.info(`[DB] ${model}.${action} - ${duration}ms`);
  
  // 느린 쿼리 감지 (100ms 이상)
  if (duration > 100) {
    logger.warn(`[SLOW QUERY] ${model}.${action} - ${duration}ms - Args: ${JSON.stringify(params.args)}`);
  }
  
  return result;
});

// export const pool = mysql.createPool({
//   host: process.env.DB_HOST, // mysql의 hostname
//   user: process.env.DB_USER, // user 이름
//   port: process.env.DB_PORT, // 포트 번호
//   database: process.env.DB_NAME, // 데이터베이스 이름
//   password: process.env.DB_PASSWORD , // 비밀번호
//   waitForConnections: true,
//   // Pool에 획득할 수 있는 connection이 없을 때,
//   // true면 요청을 queue에 넣고 connection을 사용할 수 있게 되면 요청을 실행하며, false이면 즉시 오류를 내보내고 다시 요청
//   connectionLimit: 10, // 몇 개의 커넥션을 가지게끔 할 것인지
//   queueLimit: 0, // getConnection에서 오류가 발생하기 전에 Pool에 대기할 요청의 개수 한도
// });
