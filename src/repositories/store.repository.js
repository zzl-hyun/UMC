import { prisma } from "../db.config.js";
// 상점 추가
export const addStore = async (regionId, data) => {  
  try {
    const store = await prisma.store.create({
      data: {
        region_id: regionId,
        name: data.name,
        address: data.address,
        score: data.score,
        created_at: new Date(),
        updated_at: new Date()
      }
    })
    
    return store.id;
  } catch (err) {
    throw new Error(`상점 추가 중 오류가 발생했습니다: ${err.message}`);
  } 
};

// 상점 조회
export const getStoreById = async (storeId) => {  
  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        region: true
      }
    })
    if (!store) {
      throw new Error("존재하지 않는 상점입니다.");
    }
    
    return store.id;
  } catch (err) {
    throw new Error(`상점 조회 중 오류가 발생했습니다: ${err.message}`);
  } 
};