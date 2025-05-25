export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).error({
      errorCode: "UNAUTHORIZED",
      reason: "로그인이 필요합니다.",
      data: null
    });
  }
  next();
};

export const getCurrentUserId = (req) => {
  return req.user?.id;
};

export const getCurrentUserEmail = (req) => {
  return req.user?.email;
};