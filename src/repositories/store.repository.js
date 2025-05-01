import { pool } from "../db.config.js";

// 상점 추가
export const addStore = async (regionId, data) => {
  const conn = await pool.getConnection();
  
  try {
    const [result] = await pool.query(
      `INSERT INTO store (region_id, name, address, score, created_at, updated_at) 
       VALUES (?, ?, ?, ?, NOW(), NOW());`,
      [regionId, data.name, data.address, data.score]
    );
    
    return result.insertId;
  } catch (err) {
    throw new Error(`상점 추가 중 오류가 발생했습니다: ${err.message}`);
  } finally {
    conn.release();
  }
};

// 상점 조회
export const getStoreById = async (storeId) => {
  const conn = await pool.getConnection();
  
  try {
    const [store] = await pool.query(
      `SELECT * FROM store WHERE id = ?;`,
      [storeId]
    );
    
    if (store.length === 0) {
      throw new Error("존재하지 않는 상점입니다.");
    }
    
    return store[0];
  } catch (err) {
    throw new Error(`상점 조회 중 오류가 발생했습니다: ${err.message}`);
  } finally {
    conn.release();
  }
};