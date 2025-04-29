import * as missionRepository from '../repositories/mission.repository.js';
import * as storeRepository from '../repositories/store.repository.js';

export const createMission = async (storeId, missionData) => {
  // 가게가 존재하는지 확인
  const store = await storeRepository.getStoreById(storeId);
  
  if (!store) {
    throw new Error('존재하지 않는 가게입니다.');
  }
  
  // 미션 생성
  const missionId = await missionRepository.createMission(storeId, missionData);
  
  // 생성된 미션 정보 조회
  const mission = await missionRepository.getMissionById(missionId);
  
  return mission;
};