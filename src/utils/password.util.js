import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

/**
 * 비밀번호를 해시화합니다.
 * @param {string} password - 원본 비밀번호
 * @returns {Promise<string>} 해시화된 비밀번호
 */
export const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    throw new Error('비밀번호 암호화 중 오류가 발생했습니다.');
  }
};

/**
 * 비밀번호를 검증합니다.
 * @param {string} password - 입력받은 비밀번호
 * @param {string} hashedPassword - 저장된 해시 비밀번호
 * @returns {Promise<boolean>} 일치 여부
 */
export const verifyPassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error('비밀번호 검증 중 오류가 발생했습니다.');
  }
};

/**
 * 비밀번호 유효성을 검사합니다.
 * @param {string} password - 검사할 비밀번호
 * @returns {boolean} 유효성 여부
 */
export const validatePassword = (password) => {
  // 최소 8자, 최대 50자, 영문 대소문자, 숫자, 특수문자 포함
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/;
  return passwordRegex.test(password);
};