export const bodyToStore = (body) => {
    return{
        name: body.name,
        address: body.address,
        score: body.score,
    };
};