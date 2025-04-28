
import { pool } from "../db.config.js";

export const addStore = async (regionId, storeData) => {
    const conn = await pool.getConnection();
    
    try {
      const [result] = await pool.query(
        `INSERT INTO store (region_id, name, address, score, created_at, updated_at) 
         VALUES (?, ?, ?, ?, NOW(), NOW());`,
        [regionId, storeData.name, storeData.address, storeData.score || 0]
      );
      
      return result.insertId;
    } catch (err) {
      throw new Error(`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`);
    } finally {
      conn.release();
    }
  };

  