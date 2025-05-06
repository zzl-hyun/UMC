export const bodyToReview = (body) => {
    return {
        userId: body.userId, // memberId가 아닌 userId로 변경 (DB 컬럼명과 일치)
        body: body.body,
        score: body.score,
        imageUrl: body.imageUrl || null, // 선택적 필드 처리
    }
}

// export const responseFromReview = (review) => {
//     return {
//         id: review.id,
//         body: review.body,
//         score: review.score,
//         imageUrl: review.image_url,
//         createdAt: review.created_at,
//         userId: review.user_id,
//         storeId: review.store_id
//     };
// }
export const responseFromReview = (reivews) => {
    return{
        data: reivews,
        pagenation: {
            cursor: reivews.length ? reivews[reivews.length - 1].id : null,
        },
    };
};