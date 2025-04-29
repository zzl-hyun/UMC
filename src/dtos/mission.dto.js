export const bodyToMission = (body) => {
    return{
        reward: body.reward,
        deadline: body.deadline,
        missionSpec: body.missionSpec,
    }
};