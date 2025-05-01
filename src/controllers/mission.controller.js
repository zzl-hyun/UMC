import { StatusCodes } from "http-status-codes";
import * as missionService from '../services/mission.service.js';
import { bodyToChallengeMission } from '../dtos/mission.dto.js';


export const challengeMission = async (req, res, next) => {
  try {
    const missionId = req.params.missionId;
    
    // 미션 도전하기
    const userMission = await missionService.challengeMission(missionId, bodyToChallengeMission(req.body));
    
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: '미션 도전이 성공적으로 추가되었습니다.',
      data: userMission
    });
  } catch (err) {
    next(err);
  }
};