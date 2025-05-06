import { 
  addMission, 
  getMissionById, 
  getUserMissionByUserAndMission, 
  addUserMission,
  getUserMissionWithDetails,
  getStoreMissions,
  getUserMissions,
  updateUserMissionStatus
} from "../repositories/mission.repository.js";
import { getStoreById } from "../repositories/store.repository.js";
import { responseFromMemberMission, responseFromMission } from "../dtos/mission.dto.js";


export const createMission = async (storeId, missionData) => {
  // 상점이 존재하는지 확인
  await getStoreById(storeId);

  // 미션 생성
  const missionId = await addMission(storeId, missionData);
  
  // 생성된 미션 정보 조회
  const mission = await getMissionById(missionId);
  
  return responseFromMission(mission);
};


export const challengeMission = async (missionId, userData) => {
  // 사용자 미션 참여 등록
  const userMissionId = await addUserMission(userData.userId, missionId);
  
  // 생성된 사용자 미션 정보 조회
  const userMission = await getUserMissionWithDetails(userMissionId);
  
  return responseFromMemberMission(userMission);
};

// 특정 가게의 미션 목록 조회
export const listStoreMissions = async (storeId, cursor = 0) => {
  // 가게 존재 여부 확인
  const store = await getStoreById(storeId);
  if (!store) {
    throw new Error("존재하지 않는 가게입니다.");
  }
  
  // 가게의 미션 목록 조회
  const missions = await getStoreMissions(storeId, cursor);
  
  // 응답 데이터 구성
  return {
    data: missions.map(mission => responseFromMission(mission)),
    pagination: {
      cursor: missions.length ? Number(missions[missions.length - 1].id) : null
    }
  };
};

// 진행 중인 미션 목록 조회
export const listUserMissions = async (userId, cursor = 0, status = '진행중') => {
  // 사용자의 미션 목록 조회
  const userMissions = await getUserMissions(userId, cursor, status);
  
  // 응답 데이터 구성
  return {
    data: userMissions.map(userMission => responseFromMemberMission(userMission)),
    pagination: {
      cursor: userMissions.length ? Number(userMissions[userMissions.length - 1].id) : null
    }
  };
};

// 미션 상태 업데이트 (완료로 변경)
export const updateMissionStatus = async (userMissionId, status) => {
  // 사용자 미션이 존재하는지 확인
  const existingMission = await getUserMissionWithDetails(userMissionId);
  if (!existingMission) {
    throw new Error("존재하지 않는 미션 참여 정보입니다.");
  }
  
  // 이미 같은 상태인지 확인
  if (existingMission.status === status) {
    throw new Error(`이미 '${status}' 상태인 미션입니다.`);
  }
  
  // 유효한 상태값인지 확인 (예: 진행중, 완료, 포기 등만 허용)
  const validStatuses = ['진행중', '완료', '포기', '실패'];
  if (!validStatuses.includes(status)) {
    throw new Error(`'${status}'는 유효하지 않은 상태값입니다. ${validStatuses.join(', ')} 중 하나를 사용하세요.`);
  }
    
  // 미션 상태 업데이트
  const updatedMission = await updateUserMissionStatus(userMissionId, status);
  
  return responseFromMemberMission(updatedMission);
};