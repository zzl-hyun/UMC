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
    const userData = user[0];
    const prefeCategory = preferences.map(pref => pref.name);

    return{
        email: userData.email,
        name: userData.name,
        prefeCategory
    };

};