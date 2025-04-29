import { pool } from "../db.config.js";

export const createMission = async (storeId, missionData) => {
  const conn = await pool.getConnection();
  
  try {
    const [result] = await pool.query(
      `INSERT INTO mission (store_id, reward, deadline, mission_spec, created_at, updated_at) 
       VALUES (?, ?, ?, ?, NOW(), NOW());`,
      [storeId, missionData.reward, missionData.deadline, missionData.missionSpec]
    );
    
    return result.insertId;
  } catch (err) {
    throw new Error(`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`);
  } finally {
    conn.release();
  }
};

export const getMissionById = async (missionId) => {
  const conn = await pool.getConnection();
  
  try {
    const [rows] = await pool.query(
      `SELECT m.*, s.name as store_name 
       FROM mission m
       JOIN store s ON m.store_id = s.id
       WHERE m.id = ?;`,
      [missionId]
    );
    
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    throw new Error(`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`);
  } finally {
    conn.release();
  }
};

export const checkAlreadyChallenging = async (memberId, missionId) => {
  const conn = await pool.getConnection();
  
  try {
    const [result] = await pool.query(
      `SELECT EXISTS(
        SELECT 1 FROM member_mission 
        WHERE member_id = ? AND mission_id = ?
      ) as already_challenging;`,
      [memberId, missionId]
    );
    
    return result[0].already_challenging === 1;
  } catch (err) {
    throw new Error(`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`);
  } finally {
    conn.release();
  }
};

export const challengeMission = async (memberId, missionId) => {
  const conn = await pool.getConnection();
  
  try {
    const [result] = await pool.query(
      `INSERT INTO member_mission (member_id, mission_id, status, created_at, updated_at) 
       VALUES (?, ?, '진행중', NOW(), NOW());`,
      [memberId, missionId]
    );
    
    return result.insertId;
  } catch (err) {
    throw new Error(`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`);
  } finally {
    conn.release();
  }
};

export const getMemberMission = async (memberId, missionId) => {
  const conn = await pool.getConnection();
  
  try {
    const [rows] = await pool.query(
      `SELECT mm.*, m.mission_spec, m.reward, m.deadline, s.name as store_name
       FROM member_mission mm
       JOIN mission m ON mm.mission_id = m.id
       JOIN store s ON m.store_id = s.id
       WHERE mm.member_id = ? AND mm.mission_id = ?;`,
      [memberId, missionId]
    );
    
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    throw new Error(`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`);
  } finally {
    conn.release();
  }
};