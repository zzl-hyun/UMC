import { pool } from "../db.config.js";

// 지역 조회
export const getRegionById = async (regionId) => {
  const conn = await pool.getConnection();
  
  try {
    const [region] = await pool.query(
      `SELECT * FROM region WHERE id = ?;`,
      [regionId]
    );
    
    if (region.length === 0) {
      throw new Error("존재하지 않는 지역입니다.");
    }
    
    return region[0];
  } catch (err) {
    throw new Error(`지역 조회 중 오류가 발생했습니다: ${err.message}`);
  } finally {
    conn.release();
  }
};