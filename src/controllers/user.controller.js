import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import * as reviewService from "../services/review.service.js"
export const handleUserSignUp = async (req, res, next) => {
  try{

    console.log("회원가입을 요청했습니다!");
    console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용
    
    const user = await userSignUp(bodyToUser(req.body));
    res.status(StatusCodes.OK).json({ result: user });
  }catch(err){
    next(err);
  }
};

export const handleListUserReviews = async (req, res, next) => {
  try{
    const userId = parseInt(req.params.userId);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;
    
    const result = await reviewService.listUserReviews(userId, cursor);
    
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: '내가 작성한 리뷰 목록을 성공적으로 조회했습니다.',
      result
    });
  }catch (err){
    next(err);
  }
};