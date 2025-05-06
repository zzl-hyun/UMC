export const bodyToStore = (body) => {
    return {
        name: body.name,
        address: body.address,
        score: body.score || 0, // 기본값 설정
    };
};

export const responseFromStore = (store) => {
    return {
        id: Number(store.id),
        name: store.name,
        address: store.address,
        score: store.score,
        regionId: store.region_id,
        createdAt: store.created_at,
        updatedAt: store.updated_at
    };
};