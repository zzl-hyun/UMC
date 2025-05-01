import { pool } from "../db.config.js";

// 미션 추가
export const addMission = async (storeId, data) => {
  const conn = await pool.getConnection();
  
  try {
    const deadlineDate = new Date(data.deadline);

    const [result] = await pool.query(
      `INSERT INTO mission (store_id, reward, deadline, mission_spec, created_at, updated_at) 
       VALUES (?, ?, ?, ?, NOW(), NOW());`,
      [storeId, data.reward, deadlineDate, data.missionSpec]
    );
    
    return result.insertId;
  } catch (err) {
    throw new Error(`미션 추가 중 오류가 발생했습니다: ${err.message}`);
  } finally {
    conn.release();
  }
};

// 미션 조회
export const getMissionById = async (missionId) => {
  const conn = await pool.getConnection();
  
  try {
    const [mission] = await pool.query(
      `SELECT m.*, s.name as store_name 
       FROM mission m 
       JOIN store s ON m.store_id = s.id 
       WHERE m.id = ?;`,
      [missionId]
    );
    
    if (mission.length === 0) {
      return null;
    }
    
    return mission[0];
  } catch (err) {
    throw new Error(`미션 조회 중 오류가 발생했습니다: ${err.message}`);
  } finally {
    conn.release();
  }
};

// 사용자와 미션 ID로 이미 참여한 미션인지 확인
export const getUserMissionByUserAndMission = async (userId, missionId) => {
  const conn = await pool.getConnection();
  
  try {
    const [userMission] = await pool.query(
      `SELECT * FROM user_mission WHERE user_id = ? AND mission_id = ?;`,
      [userId, missionId]
    );
    
    if (userMission.length === 0) {
      return null;
    }
    
    return userMission[0];
  } catch (err) {
    throw new Error(`사용자 미션 조회 중 오류가 발생했습니다: ${err.message}`);
  } finally {
    conn.release();
  }
};

// 사용자 미션 추가
export const addUserMission = async (userId, missionId) => {
  const conn = await pool.getConnection();
  
  try {
    const [result] = await pool.query(
      `INSERT INTO user_mission (user_id, mission_id, status, created_at, updated_at) 
       VALUES (?, ?, '진행중', NOW(), NOW());`,
      [userId, missionId]
    );
    
    return result.insertId;
  } catch (err) {
    throw new Error(`사용자 미션 추가 중 오류가 발생했습니다: ${err.message}`);
  } finally {
    conn.release();
  }
};

// 사용자 미션 상세 정보 조회
export const getUserMissionWithDetails = async (userMissionId) => {
  const conn = await pool.getConnection();
  
  try {
    const [userMission] = await pool.query(
      `SELECT um.*, m.reward, m.deadline, m.mission_spec, s.name as store_name
       FROM user_mission um
       JOIN mission m ON um.mission_id = m.id
       JOIN store s ON m.store_id = s.id
       WHERE um.id = ?;`,
      [userMissionId]
    );
    
    if (userMission.length === 0) {
      return null;
    }
    
    return userMission[0];
  } catch (err) {
    throw new Error(`사용자 미션 조회 중 오류가 발생했습니다: ${err.message}`);
  } finally {
    conn.release();
  }
};