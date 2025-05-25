import { prisma } from "../db.config.js";

// User 데이터 삽입
export const addUser = async (data) => {
  const user = await prisma.user.findFirst({ where: { email: data.email } });
  if (user) {
    return null;
  }

  const created = await prisma.user.create({ data: data });
  return created.id;
};

// 사용자 정보 얻기
export const getUser = async (userId) => {
  const user = await prisma.user.findFirstOrThrow({ where: { id: userId } });
  return user;
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId, foodCategoryId) => {
  await prisma.userFavorCategory.create({
    data: {
      userId: userId,
      foodCategoryId: foodCategoryId,
    },
  });
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
  const preferences = await prisma.userFavorCategory.findMany({
    select: {
      id: true,
      userId: true,
      foodCategoryId: true,
      foodCategory: true,
    },
    where: { userId: userId },
    orderBy: { foodCategoryId: "asc" },
  });

  return preferences;
};

// 사용자 프로필 업데이트
export const updateUserProfile = async (userId, updateData) => {
    try {
        const updatedUser = await prisma.user.update({
            where: { id: BigInt(userId) },
            data: {
                ...updateData,
                updated_at: new Date()
            }
        });
        
        return updatedUser.id;
    } catch (err) {
        if (err.code === 'P2025') {
            return null; // 사용자를 찾을 수 없음
        }
        throw new Error(`사용자 프로필 업데이트 중 오류가 발생했습니다: ${err.message}`);
    }
};

// 사용자 선호 카테고리 업데이트
export const updateUserPreferences = async (userId, preferences) => {
    try {
        // 기존 선호 카테고리 삭제
        await prisma.userFavorCategory.deleteMany({
            where: { user_id: BigInt(userId) }
        });
        
        // 새로운 선호 카테고리 추가
        if (preferences && preferences.length > 0) {
            const preferenceData = preferences.map(categoryId => ({
                user_id: BigInt(userId),
                category_id: BigInt(categoryId)
            }));
            
            await prisma.userFavorCategory.createMany({
                data: preferenceData
            });
        }
        
        return true;
    } catch (err) {
        throw new Error(`사용자 선호 카테고리 업데이트 중 오류가 발생했습니다: ${err.message}`);
    }
};