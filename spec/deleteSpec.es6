import * as consts from "./config";
import {api, randomString} from "./utils";


describe("Testing DELETE requests", function(){

    it("returns status code OK with permission", function(done){
        api.get(consts.VALID_ENDPOINT, undefined, undefined, function(data, error){
            expect(data.content.length).toBeGreaterThan(0);
            expect(error).toBeUndefined();

            const validEntry = data.content[0];

            api.del(consts.VALID_ENDPOINT, {ID_UNIT_TEST: validEntry.ID_UNIT_TEST}, function(affectedRows, error){
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