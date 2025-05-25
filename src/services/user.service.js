import {
    addUser,
    getUser,
    getUserByEmail,
    getUserPreferencesByUserId,
    setPreference,
    updateUserProfile,
    updateUserPreferences,
    updateUserPassword,
} from "../repositories/user.repository.js"
import { responseFromUser, validateSignupData } from "../dtos/user.dto.js";
import { DuplicateUserEmailError } from "../error.js";
import { hashPassword, verifyPassword } from "../utils/password.util.js";

export const userSignUp = async (data) => {
    // 입력 데이터 유효성 검사
    const validationErrors = validateSignupData(data);
    if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(' '));
    }

    // 비밀번호 암호화
    const hashedPassword = await hashPassword(data.password);

    const joinUserId = await addUser({
        email: data.email,
        name: data.name,
        gender: data.gender,
        birth: data.birth,
        address: data.address,
        detailAddress: data.detailAddress,
        phoneNumber: data.phoneNumber,
        password: hashedPassword, // 암호화된 비밀번호 저장
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

// 로그인 처리
export const authenticateUser = async (email, password) => {
    const user = await getUserByEmail(email);
    
    if (!user) {
        return null;
    }

    // 소셜 로그인 사용자인 경우
    if (!user.password) {
        throw new Error('소셜 로그인으로 가입된 계정입니다. 해당 플랫폼으로 로그인해주세요.');
    }

    // 비밀번호 검증
    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
        return null;
    }

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        loginType: 'LOCAL'
    };
};

// 사용자 존재 여부 확인 함수
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
    await validateUserExists(userId);
    
    const updatedUserId = await updateUserProfile(userId, updateData.profileData);
    
    if (updatedUserId === null) {
        throw new Error("사용자 프로필 업데이트에 실패했습니다.");
    }
    
    if (updateData.preferences) {
        await updateUserPreferences(userId, updateData.preferences);
    }
    
    const user = await getUser(userId);
    const preferences = await getUserPreferencesByUserId(userId);
    
    return responseFromUser({user, preferences});
};

// 비밀번호 변경
export const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await validateUserExists(userId);
    
    // 소셜 로그인 사용자인 경우
    if (!user.password) {
        throw new Error('소셜 로그인 사용자는 비밀번호를 변경할 수 없습니다.');
    }

    // 현재 비밀번호 확인
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
        throw new Error('현재 비밀번호가 올바르지 않습니다.');
    }

    // 새 비밀번호 암호화
    const hashedNewPassword = await hashPassword(newPassword);
    
    // 비밀번호 업데이트
    const updatedUserId = await updateUserPassword(userId, hashedNewPassword);
    
    if (updatedUserId === null) {
        throw new Error("비밀번호 변경에 실패했습니다.");
    }

    return true;
};