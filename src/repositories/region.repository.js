import { pool } from "../db.config";

export const getRegionById = async (regionId) => {
    const conn = await pool.getConnection();

    try{
        const [rows] = await pool.query(
            `SELECT * FROM region WHERE id = ?;`, [regionId]
        );

        return rows.length > 0 ? rows[0] : null;
    } catch (err){
        throw new Error(`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`);
    }finally{
        conn.release();
    }
};