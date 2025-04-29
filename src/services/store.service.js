import * as storeRepository from '../repositories/store.repository';
import * as regionRepository from '../repositories/region.repository';

export const createStore = async (regionId, StoreData) => {
    // 존재하는지
    const region = await regionRepository.getRegionById(regionId);
    if(!region) throw new Error('해당 지역을 찾을 수 없습니다.');

    // Create Store
    const storeId = await storeRepository.createStore(regionId, storeData);

    const store = await storeRepository.getStoreById(storeId);

    return store;
};