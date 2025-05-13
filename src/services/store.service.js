import { addStore, getStoreById, findStoreByNameAndAddress } from "../repositories/store.repository.js";
import { getAllStoreReviews } from "../repositories/review.repository.js";
import { getRegionById } from "../repositories/region.repository.js";
import { responseFromStore } from "../dtos/store.dto.js";
import { responseFromReviews} from "../dtos/reiveiw.dto.js";
import { DuplicateStoreError, RegionNotFoundError } from "../error.js";

export const createStore = async (regionId, storeData) => {
    const region = await getRegionById(regionId);
    if(!region) throw new RegionNotFoundError('해당 지역을 찾을 수 없습니다.', regionId);

    const existingStore = await findStoreByNameAndAddress(storeData.name, storeData.address);
    if(existingStore) {
        throw new DuplicateStoreError('이미 존재하는 상점입니다.', storeData);
    }

    const storeId = await addStore(regionId, storeData);

    const store = await getStoreById(storeId);
    return responseFromStore(store);
};

export const listStoreReviews = async (storeId, cursor = 0) => {
    const reviews = await getAllStoreReviews(storeId, cursor);
    return responseFromReviews(reviews);
  }