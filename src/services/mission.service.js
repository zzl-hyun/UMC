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

export const challengeMission = async (missionId, memberId) => {
  // 미션이 존재하는지 확인
  const mission = await missionRepository.getMissionById(missionId);
  
  if (!mission) {
    throw new Error('존재하지 않는 미션입니다.');
  }
  
  // 이미 도전 중인 미션인지 확인
  const alreadyChallenging = await missionRepository.checkAlreadyChallenging(memberId, missionId);
  
  if (alreadyChallenging) {
    throw new Error('이미 도전 중인 미션입니다.');
  }
  
  // 미션 도전하기
  await missionRepository.challengeMission(memberId, missionId);
  
  // 도전 중인 미션 정보 조회
  const memberMission = await missionRepository.getMemberMission(memberId, missionId);
  
  return memberMission;
};