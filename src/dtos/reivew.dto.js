export const bodyToReview = (body) => {
    return{
        userId: body.userId,
        body: body.body,
        score: body.score,
        imageUrl: body.imageUrl,
    }
}