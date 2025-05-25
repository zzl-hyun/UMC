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
        preferences: body.preferences,
    }
}

/**
 * 
 * @param {Array} user
 * @param {Array} preferences 
 */
export const responseFromUser = ({user, preferences}) => {
    // const userData = user[0];
    // const prefeCategory = preferences.map(pref => pref.name);
    const preferFoods = preferences.map(
        preference => preference.foodCategory.name
    );

    return{
        // email: userData.email,
        // name: userData.name,
        // prefeCategory
        email: user.email,
        name: user.name,
        preferCategory: preferFoods,
    };

};

export const bodyToUpdateProfile = (body) => {
    const updateData = {};
    
    // 선택적으로 업데이트할 수 있는 필드들
    if (body.name !== undefined) updateData.name = body.name;
    if (body.gender !== undefined) updateData.gender = body.gender;
    if (body.birth !== undefined) updateData.birth = new Date(body.birth);
    if (body.address !== undefined) updateData.address = body.address;
    if (body.detailAddress !== undefined) updateData.detailAddress = body.detailAddress;
    if (body.phoneNumber !== undefined) updateData.phoneNumber = body.phoneNumber;
    
    return updateData;
};