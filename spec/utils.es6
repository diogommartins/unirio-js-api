import {Unirio} from "../lib/api";
import * as consts from "./config";


export function randomString(length){
    return Math.random().toString(length).slice(2);
}

export const api = new Unirio.API(consts.KEYS.VALID[consts.TEST_ENV], Unirio.APIServers[consts.TEST_ENV]);