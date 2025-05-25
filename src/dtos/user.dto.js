import { validatePassword } from "../utils/password.util.js";

export const bodyToUser = (body) => {
    const birth = new Date(body.birth);

    return{
        email: body.email,
        name: body.name,
        gender: body.gender,
        birth,
        address: body.address || "",
        detailAddress: body.detailAddress || "",
        phoneNumber: body.phoneNumber,
        password: body.password, // 비밀번호 추가
        preferences: body.preferences,
    }
}

export const bodyToLogin = (body) => {
    return {
        email: body.email,
        password: body.password
    }
}

export const responseFromUser = ({user, preferences}) => {
    const preferFoods = preferences.map(
        preference => preference.foodCategory.name
    );

    return{
        id: user.id,
        email: user.email,
        name: user.name,
        preferCategory: preferFoods,
    };
};

export const bodyToUpdateProfile = (body) => {
    const updateData = {};
    
    if (body.name !== undefined) updateData.name = body.name;
    if (body.gender !== undefined) updateData.gender = body.gender;
    if (body.birth !== undefined) updateData.birth = new Date(body.birth);
    if (body.address !== undefined) updateData.address = body.address;
    if (body.detailAddress !== undefined) updateData.detailAddress = body.detailAddress;
    if (body.phoneNumber !== undefined) updateData.phoneNumber = body.phoneNumber;
    
    return updateData;
};

// 비밀번호 변경용 DTO
export const bodyToChangePassword = (body) => {
    return {
        currentPassword: body.currentPassword,
        newPassword: body.newPassword,
        confirmPassword: body.confirmPassword
    };
};

// 회원가입 데이터 유효성 검사
export const validateSignupData = (data) => {
    const errors = [];

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('유효한 이메일 주소를 입력해주세요.');
    }

    if (!data.password || !validatePassword(data.password)) {
        errors.push('비밀번호는 8-50자이며, 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.');
    }

    if (!data.name || data.name.trim().length < 2) {
        errors.push('이름은 2자 이상이어야 합니다.');
    }

    return errors;
};