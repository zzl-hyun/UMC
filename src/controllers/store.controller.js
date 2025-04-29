import * as storeService from '../services/store.service';
import { bodyToStore } from '../dtos/store.dto';
import { StatusCodes } from "http-status-codes";

export const createStore = async(req, res) => {
    try{
        const regionId = req.params.regionId;

        const store = await storeService.createStore(regionId, bodyToStore(req.body));

        res.status(StatusCodes.CREATED).json({ result: store });
        
    } catch (err){
        next(err);
    }
};