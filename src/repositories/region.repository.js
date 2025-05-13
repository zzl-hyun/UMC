import { prisma } from "../db.config.js";
import { RegionNotFoundError } from "../error.js";
// 지역 조회
export const getRegionById = async (regionId) => {
  try {
    const region = await prisma.region.findUnique({
      where: { id: parseInt(regionId) }
    });
    
    return region;
  } catch (err) {
    throw err
  }
};