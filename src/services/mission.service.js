import { 
  addMission, 
  getMissionById, 
  getUserMissionByUserAndMission, 
  addUserMission,
  getUserMissionWithDetails
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
  // 해당 미션 존재 여부 확인
  const mission = await getMissionById(missionId);
  if (!mission) {
    throw new Error("존재하지 않는 미션입니다.");
  }
  
  // 이미 참여한 미션인지 확인
  const existingUserMission = await getUserMissionByUserAndMission(userData.userId, missionId);
  if (existingUserMission) {
    throw new Error("이미 참여한 미션입니다.");
  }
  
  // 사용자 미션 참여 등록
  const userMissionId = await addUserMission(userData.userId, missionId);
  
  // 생성된 사용자 미션 정보 조회
  const userMission = await getUserMissionWithDetails(userMissionId);
  
  return responseFromMemberMission(userMission);
};