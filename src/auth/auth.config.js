import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "../db.config.js";

dotenv.config();

export const localStrategy = new LocalStrategy(
  {
    usernameField: 'email', // 이메일을 username으로 사용
    passwordField: 'password',
    passReqToCallback: false
  },
  async (email, password, done) => {
    try {
      // 사용자 조회
      const user = await prisma.user.findFirst({
        where: { 
          email: email,
          status: 'ACTIVE' // 활성 상태인 사용자만
        }
      });

      if (!user) {
        return done(null, false, { message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }

      // 소셜 로그인 사용자인 경우 (비밀번호가 없는 경우)
      if (!user.password) {
        return done(null, false, { message: '소셜 로그인으로 가입된 계정입니다. 해당 플랫폼으로 로그인해주세요.' });
      }

      // 비밀번호 검증
      const isPasswordValid = await verifyPassword(password, user.password);
      
      if (!isPasswordValid) {
        return done(null, false, { message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }

      // 로그인 성공
      return done(null, {
        id: user.id,
        email: user.email,
        name: user.name,
        loginType: 'LOCAL'
      });

    } catch (error) {
      console.error('Local authentication error:', error);
      return done(error);
    }
  }
);

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.PASSPORT_GOOGLE_CALLBACK_URL,
    scope: ["email", "profile"],
    state: true,
  },
  (accessToken, refreshToken, profile, cb) => {
    return googleVerify(profile)
      .then((user) => cb(null, user))
      .catch((err) => cb(err));
  }
);

export const kakaoStrategy = new KakaoStrategy(
  {
    clientID: process.env.PASSPORT_KAKAO_CLIENT_ID,
    clientSecret: process.env.PASSPORT_KAKAO_CLIENT_SECRET,
    callbackURL: process.env.PASSPORT_KAKAO_CALLBACK_URL,
  },
  (accessToken, refreshToken, profile, cb) => {
    return kakaoVerify(profile)
      .then((user) => cb(null, user))
      .catch((err) => cb(err));
  }
);

const googleVerify = async (profile) => {
  const email = profile.emails?.[0]?.value;
  if (!email) {
    throw new Error(`profile.email was not found: ${profile}`);
  }

  const user = await prisma.user.findFirst({ where: { email } });
  if (user !== null) {
    return { id: user.id, email: user.email, name: user.name };
  }

  const created = await prisma.user.create({
    data: {
      email,
      name: profile.displayName,
      gender: "추후 수정",
      birth: new Date(1970, 0, 1),
      address: "추후 수정",
      detailAddress: "추후 수정",
      phoneNumber: "추후 수정",
      social_type: "GOOGLE",
    },
  });

  return { id: created.id, email: created.email, name: created.name };
};

const kakaoVerify = async (profile) => {
  const email = profile._json?.kakao_account?.email;
  const nickname = profile.displayName || profile._json?.kakao_account?.profile?.nickname;
  const kakaoId = profile.id;
  
  // 이메일이 없는 경우 Kakao ID로 고유한 이메일 생성
  const userEmail = email || `kakao_${kakaoId}@kakao.local`;
  
  console.log('Kakao Profile:', {
    id: kakaoId,
    email: userEmail,
    nickname: nickname,
    hasEmail: !!email
  });

  // 이메일 또는 Kakao ID로 기존 사용자 찾기
  let user = await prisma.user.findFirst({ 
    where: { 
      OR: [
        { email: userEmail },
        { email: `kakao_${kakaoId}@kakao.local` }
      ]
    } 
  });

  if (user !== null) {
    return { id: user.id, email: user.email, name: user.name };
  }

  // 새 사용자 생성
  const created = await prisma.user.create({
    data: {
      email: userEmail,
      name: nickname || "카카오 사용자",
      gender: "추후 수정",
      birth: new Date(1970, 0, 1),
      address: "추후 수정",
      detailAddress: "추후 수정",
      phoneNumber: "추후 수정",
      social_type: "KAKAO",
    },
  });

  return { id: created.id, email: created.email, name: created.name };
};