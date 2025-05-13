import { StatusCodes } from "http-status-codes";
import * as missionService from '../services/mission.service.js';
import { bodyToChallengeMission } from '../dtos/mission.dto.js';


export const challengeMission = async (req, res, next) => {
  try {
    const missionId = req.params.missionId;
    
    // 미션 도전하기
    const userMission = await missionService.challengeMission(missionId, bodyToChallengeMission(req.body));
    
    res.status(StatusCodes.CREATED).success(userMission);
  } catch (err) {
    next(err);
  }
};

// 미션 상태 업데이트
export const UpdateMissionStatus = async (req, res, next) => {
  try {
    const userMissionId = parseInt(req.params.userMissionId);
    const status = req.query.status || '완료';
    
    const result = await missionService.updateMissionStatus(userMissionId, status);
    
    res.status(StatusCodes.OK).success(result);
  } catch (err) {
    next(err);
  }
};