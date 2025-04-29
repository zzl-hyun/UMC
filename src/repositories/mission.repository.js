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