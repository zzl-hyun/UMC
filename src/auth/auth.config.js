import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { prisma } from "../db.config.js";

dotenv.config();

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