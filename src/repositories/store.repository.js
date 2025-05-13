import { prisma } from "../db.config.js";
import { 
  StoreNotFoundError,
  StoreCreationError,
  StoreQueryError
 } from "../error.js";
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
    throw err;
  } 
};

// 이름과 주소로 상점 조회 (중복 체크용)
export const findStoreByNameAndAddress = async (name, address) => {
  try {
    const store = await prisma.store.findFirst({
      where: { 
        name: name,
        address: address
      }
    });
    
    return store;
  } catch (err) {
    throw err;
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
    
    return store;
  } catch (err) {
    throw err;
  } 
};