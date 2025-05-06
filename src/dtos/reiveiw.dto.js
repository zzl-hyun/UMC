export const bodyToReview = (body) => {
    return {
        userId: body.userId, // memberId가 아닌 userId로 변경 (DB 컬럼명과 일치)
        body: body.body,
        score: body.score,
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
export const responseFromSingleReview = (review) => {
    return {
        id: Number(review.id),
        body: review.body,
        score: review.score,
        userId: review.user_id ? Number(review.user_id) : null,
        storeId: review.store_id ? Number(review.store_id) : null,
        createdAt: review.created_at,
        updatedAt: review.updated_at
    };
}

export const responseFromReviews = (reviews) => {
    return {
        data: reviews.map(review => ({
            id: Number(review.id),
            body: review.body,
            score: review.score,
            userId: review.user_id ? Number(review.user_id) : null,
            storeId: review.store_id ? Number(review.store_id) : null,
            createdAt: review.created_at,
            updatedAt: review.updated_at
        })),
        pagenation: {
            cursor: reviews.length ? Number(reviews[reviews.length - 1].id) : null,
        }
    };
};