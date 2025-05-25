import {
    addUser,
    getUser,
    getUserPreferencesByUserId,
    setPreference,
    updateUserProfile,
    updateUserPreferences,
} from "../repositories/user.repository.js"
import { responseFromUser } from "../dtos/user.dto.js";
import { DuplicateUserEmailError } from "../error.js";

export const userSignUp = async (data) => {
    const joinUserId = await addUser({
        email: data.email,
        name: data.name,
        gender: data.gender,
        birth: data.birth,
        address: data.address,
        detailAddress: data.detailAddress,
        phoneNumber: data.phoneNumber,
    });

    if (joinUserId === null){
        throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
    }

    for (const preference of data.preferences){
        await setPreference(joinUserId, preference);
    }

    const user = await getUser(joinUserId);
    const preferences = await getUserPreferencesByUserId(joinUserId);

    return responseFromUser({user, preferences});
}


// 사용자 존재 여부 확인 함수 추가
export const validateUserExists = async (userId) => {
    try {
        const user = await getUser(userId);
        return user;
    } catch (error) {
        throw new Error("존재하지 않는 사용자입니다.");
    }
};

// 현재 로그인한 사용자 정보 조회
export const getCurrentUserInfo = async (userId) => {
    const user = await getUser(userId);
    const preferences = await getUserPreferencesByUserId(userId);
    return responseFromUser({user, preferences});
};

// 사용자 프로필 업데이트
export const updateProfile = async (userId, updateData) => {
    // 사용자 존재 여부 확인
    await validateUserExists(userId);
    
    // 프로필 정보 업데이트
    const updatedUserId = await updateUserProfile(userId, updateData.profileData);
    
    if (updatedUserId === null) {
        throw new Error("사용자 프로필 업데이트에 실패했습니다.");
    }
    
    // 선호 카테고리 업데이트 (있는 경우에만)
    if (updateData.preferences) {
        await updateUserPreferences(userId, updateData.preferences);
    }
    
    // 업데이트된 사용자 정보 반환
    const user = await getUser(userId);
    const preferences = await getUserPreferencesByUserId(userId);
    
    return responseFromUser({user, preferences});
};