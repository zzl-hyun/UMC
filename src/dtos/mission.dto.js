export const bodyToMission = (body) => {
    return {
        reward: body.reward,
        deadline: body.deadline,
        missionSpec: body.missionSpec,
    }
};

export const bodyToChallengeMission = (body) => {
    return {
        userId: body.userId, 
    }
};

export const responseFromMission = (mission) => {
    return {
        id: mission.id,
        storeId: mission.store_id,
        storeName: mission.store_name,
        reward: mission.reward,
        deadline: mission.deadline,
        missionSpec: mission.mission_spec,
        createdAt: mission.created_at,
        updatedAt: mission.updated_at
    };
};

export const responseFromMemberMission = (memberMission) => {
    return {
        id: memberMission.id,
        userId: memberMission.user_id, 
        missionId: memberMission.mission_id,
        status: memberMission.status,
        storeName: memberMission.store_name,
        missionSpec: memberMission.mission_spec,
        reward: memberMission.reward,
        deadline: memberMission.deadline,
        createdAt: memberMission.created_at,
        updatedAt: memberMission.updated_at
    };
};