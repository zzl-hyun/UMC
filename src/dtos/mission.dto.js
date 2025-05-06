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
        id: Number(mission.id),
        storeId: mission.store_id ? Number(mission.store_id) : null,
        storeName: mission.store_name || mission.store?.name || null,
        reward: mission.reward,
        deadline: mission.deadline,
        missionSpec: mission.mission_spec,
        createdAt: mission.created_at,
        updatedAt: mission.updated_at
    };
};

export const responseFromMemberMission = (memberMission) => {
    return {
        id: Number(memberMission.id),
        userId: memberMission.user_id ? Number(memberMission.user_id) : null, 
        missionId: memberMission.mission_id ? Number(memberMission.mission_id) : null,
        status: memberMission.status,
        storeName: memberMission.store_name || null,
        missionSpec: memberMission.mission_spec || null,
        reward: memberMission.reward || null,
        deadline: memberMission.deadline || null,
        createdAt: memberMission.created_at,
        updatedAt: memberMission.updated_at
    };
};

