import { prisma } from "../db.config.js";
// 지역 조회
export const getRegionById = async (regionId) => {
  try {
    const region = await prisma.region.findUnique({
      where: { id: parseInt(regionId) }
    });
    
    if (!region) {
      throw new Error("존재하지 않는 지역입니다.");
    }
    
    return region;
  } catch (err) {
    throw new Error(`지역 조회 중 오류가 발생했습니다: ${err.message}`);
  }
};