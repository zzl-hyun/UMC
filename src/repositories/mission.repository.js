import { prisma } from "../db.config.js";

// 미션 추가
export const addMission = async (storeId, data) => {
  try {
    const mission = await prisma.mission.create({
      data: {
        store_id: BigInt(storeId),
        reward: data.reward,
        deadline: new Date(data.deadline),
        mission_spec: data.missionSpec,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
    
    return mission.id;
  } catch (err) {
    console.error(`미션 추가 오류: ${err.message}`);
    throw new Error(`미션 추가 중 오류가 발생했습니다: ${err.message}`);
  }
};

// 미션 조회
export const getMissionById = async (missionId) => {
  try {
    const mission = await prisma.mission.findUnique({
      where: {
        id: BigInt(missionId)
      },
      include: {
        store: {
          select: {
            name: true
          }
        }
      }
    });
    
    if (!mission) {
      return null;
    }
    
    // store_name 필드 추가하여 원래 쿼리 결과와 동일한 구조로 만듦
    return {
      ...mission,
      store_name: mission.store?.name
    };
  } catch (err) {
    console.error(`미션 조회 오류: ${err.message}`);
    throw new Error(`미션 조회 중 오류가 발생했습니다: ${err.message}`);
  }
};

// 사용자와 미션 ID로 이미 참여한 미션인지 확인
export const getUserMissionByUserAndMission = async (userId, missionId) => {
  try {
    const userMission = await prisma.user_mission.findFirst({
      where: {
        user_id: BigInt(userId),
        mission_id: BigInt(missionId)
      }
    });
    
    return userMission;
  } catch (err) {
    console.error(`사용자 미션 조회 오류: ${err.message}`);
    throw new Error(`사용자 미션 조회 중 오류가 발생했습니다: ${err.message}`);
  }
};

// 사용자 미션 추가
export const addUserMission = async (userId, missionId) => {
  try {
    const userMission = await prisma.user_mission.create({
      data: {
        user_id: BigInt(userId),
        mission_id: BigInt(missionId),
        status: '진행중',
        created_at: new Date(),
        updated_at: new Date()
      }
    });
    
    return userMission.id;
  } catch (err) {
    console.error(`사용자 미션 추가 오류: ${err.message}`);
    throw new Error(`사용자 미션 추가 중 오류가 발생했습니다: ${err.message}`);
  }
};

// 사용자 미션 상세 정보 조회
export const getUserMissionWithDetails = async (userMissionId) => {
  try {
    const userMission = await prisma.user_mission.findUnique({
      where: {
        id: BigInt(userMissionId)
      },
      include: {
        mission: {
          select: {
            reward: true,
            deadline: true,
            mission_spec: true,
            store: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
    
    if (!userMission) {
      return null;
    }
    
    // 원래 쿼리와 동일한 결과 구조로 변환
    return {
      ...userMission,
      reward: userMission.mission?.reward,
      deadline: userMission.mission?.deadline,
      mission_spec: userMission.mission?.mission_spec,
      store_name: userMission.mission?.store?.name
    };
  } catch (err) {
    console.error(`사용자 미션 상세 조회 오류: ${err.message}`);
    throw new Error(`사용자 미션 조회 중 오류가 발생했습니다: ${err.message}`);
  }
};

// 가게의 미션 목록 조회
export const getStoreMissions = async (storeId, cursor = 0) => {
  try {
    const missions = await prisma.mission.findMany({
      where: {
        store_id: BigInt(storeId),
        ...(cursor > 0 && { id: { gt: BigInt(cursor) } })
      },
      include: {
        store: {
          select: {
            name: true
          }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 10
    });
    
    // store_name 필드 추가
    return missions.map(mission => ({
      ...mission,
      store_name: mission.store?.name
    }));
  } catch (err) {
    console.error(`가게 미션 목록 조회 오류: ${err.message}`);
    throw new Error(`가게 미션 목록 조회 중 오류가 발생했습니다: ${err.message}`);
  }
};

// 사용자의 진행 중인 미션 목록 조회
export const getUserMissions = async (userId, cursor = 0, status = '진행중') => {
  try {
    const userMissions = await prisma.user_mission.findMany({
      where: {
        user_id: BigInt(userId),
        status: status,
        ...(cursor > 0 && { id: { gt: BigInt(cursor) } })
      },
      include: {
        mission: {
          include: {
            store: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 10
    });
    
    // 응답 형식 가공
    return userMissions.map(userMission => ({
      ...userMission,
      reward: userMission.mission?.reward,
      deadline: userMission.mission?.deadline,
      mission_spec: userMission.mission?.mission_spec,
      store_name: userMission.mission?.store?.name,
      store_id: userMission.mission?.store_id
    }));
  } catch (err) {
    console.error(`사용자 미션 목록 조회 오류: ${err.message}`);
    throw new Error(`사용자 미션 목록 조회 중 오류가 발생했습니다: ${err.message}`);
  }
};