import * as missionService from '../services/mission.service.js';
import { bodyToChallengeMission } from '../dtos/ChallengeMissionDTO.js';

export const challengeMission = async (req, res) => {
  try {
        const missionId = req.params.missionId;
    
        // 미션 도전하기
        const memberMission = await missionService.challengeMission(missionId, bodyToChallengeMission(body));
        
        res.status(StatusCodes.CREATED).json({
        status: 'success',
        message: '미션 도전이 성공적으로 추가되었습니다.',
        data: mission
        });
    } catch (err){
      next(err);
    }
};