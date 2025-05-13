import { StatusCodes } from "http-status-codes";
export class DuplicateUserEmailError extends Error {
  errorCode = "U001";
  statusCode = StatusCodes.CONFLICT;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class DuplicateStoreError extends Error {
  errorCode = "S001";
  statusCode = StatusCodes.CONFLICT;
  
  constructor(reason = "이미 존재하는 상점입니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
export class StoreNotFoundError extends Error {
    errorCode = "S002";
    statusCode = StatusCodes.NOT_FOUND;

    constructor(reason = "존재하지 않는 상접입니다.", data = null){
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class StoreCreationError extends Error {
  errorCode = "S003";
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  constructor(reason = "상점 추가 중 오류가 발생했습니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class StoreQueryError extends Error {
  errorCode = "S004";
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  constructor(reason = "상점 조회 중 오류가 발생했습니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}


export class RegionNotFoundError extends Error{
    errorCode = "R002";
    statusCode = StatusCodes.NOT_FOUND;
    constructor(reason="존재하지 않는 지역입니다.", data = null){
        super(reason);
        this.reason=reason;
        this.data=data;
    }
}

export class DuplicateMisstionError extends Error{
    errorCode = "M001";
    statusCode = StatusCodes.CONFLICT;

    constructor(reason="이미 존재하는 미션입니다.", data = null){
        super(reason);
        this.reason=reason;
        this.data=data;
    }
}
export class MissionNotFoundError extends Error{
    errorCode = "M002";
    statusCode = StatusCodes.NOT_FOUND;

    constructor(reason="존재하지 않는 미션입니다.", data = null){
        super(reason);
        this.reason=reason;
        this.data=data;
    }
}
export class MissionCreationError extends Error {
  errorCode = "M003";
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  constructor(reason = "미션 추가 중 오류가 발생했습니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class MissionQueryError extends Error {
  errorCode = "M004";
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  
  constructor(reason = "미션 조회 중 오류가 발생했습니다.", data = null) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}