import { addStore, getStoreById } from "../repositories/store.repository.js";
import { getAllStoreReivews } from "../repositories/review.repository.js";
import { getRegionById } from "../repositories/region.repository.js";
import { responseFromStore } from "../dtos/store.dto.js";
import { responseFromReview } from "../dtos/reivew.dto.js";

export const createStore = async (regionId, storeData) => {
    // 존재하는지
    const region = await getRegionById(regionId);
    if(!region) throw new Error('해당 지역을 찾을 수 없습니다.');

    const storeId = await addStore(regionId, storeData);

    const store = await getStoreById(storeId);
    return responseFromStore(store);
};

export const listStoreReivews = async (storeId) => {
    const reviews = await getAllStoreReivews(storeId);
    return responseFromReview(reviews);
  }