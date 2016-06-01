import * as consts from "./config";
import {api, randomString} from "./utils";


describe("Testing DELETE requests", function(){

    it("returns status code OK with permission", function(done){
        const mockEntry = {
            PROJNAME: randomString(20)    
        };
        api.post(consts.VALID_ENDPOINT, mockEntry, function(newId, error){
            expect(newId).toBeDefined();
            expect(error).toBeUndefined();
            // A new entry is created and will be used to test delete
            api.del(consts.VALID_ENDPOINT, {ID_UNIT_TEST: newId}, function(affectedRows, error){
                expect(affectedRows).toBeGreaterThan(0);
                expect(error).toBeUndefined();
                done();
            });
        })
    });

    it("returns BAD_REQUEST without primary key", function(done){
        const params = {
            PROJNAME: randomString(20)
        };
        api.del(consts.VALID_ENDPOINT, params, function(affectedRows, error){
            expect(affectedRows).toBeUndefined();
            expect(error).toBe(400);
            done();
        })
    });

    it("returns NO_CONTENT for invalid primary key", function(done){
        const params = {
            ID_UNIT_TEST: Number.MAX_SAFE_INTEGER
        };
        api.del(consts.VALID_ENDPOINT, params, function(affectedRows, error){
            expect(affectedRows).toBeUndefined();
            expect(error).toBe(204);
            done();
        })
    })
});