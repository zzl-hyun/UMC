import winston from 'winston';
import path from 'path';

// 로그 레벨 정의
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 로그 색상 정의
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// winston에 색상 추가
winston.addColors(colors);

// 로그 포맷 정의
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// 로그 출력 대상 정의
const transports = [
  // 콘솔에 출력
  new winston.transports.Console(),
  
  // 에러 로그는 파일로 저장
  new winston.transports.File({
    filename: path.join('logs', 'error.log'),
    level: 'error',
  }),
  
  // 모든 로그는 combined.log 파일에 저장
  new winston.transports.File({ 
    filename: path.join('logs', 'combined.log'),
  }),
  
  // DB 쿼리 로그는 별도 파일에 저장
  new winston.transports.File({
    filename: path.join('logs', 'database.log'),
    level: 'info',
    // DB 로그만 필터링
    format: winston.format.combine(
      winston.format.printf(info => {
        if (info.message.startsWith('[DB]')) {
          return `${info.timestamp} ${info.level}: ${info.message}`;
        }
        return null;
      })
    )
  })
];

// Winston 로거 생성
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  levels,
  format,
  transports,
});

export const stream = {
    write: (message) => {
      logger.http(message.trim());  // 줄바꿈 문자 제거
    }
  };
  
export default logger;