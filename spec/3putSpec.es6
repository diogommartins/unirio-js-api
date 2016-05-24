import * as consts from "./config";
import {api, randomString} from "./utils";


describe("Testing PUT requests", function(){
    var validEntry;

    beforeEach(function(done){
        api.get(consts.VALID_ENDPOINT, undefined, undefined, function(data, error){
            expect(error).toBeUndefined();
            validEntry = data.content[0];
            done();
        });
    });

    afterEach(() => validEntry = undefined);

    it("returns status code OK with permission", function(done){
        const params = {
            ID_UNIT_TEST: validEntry.ID_UNIT_TEST,
            PROJNAME: randomString(30)
        };

        api.put(consts.VALID_ENDPOINT, params, function(affectedRows, error){
            expect(affectedRows).toBeGreaterThan(0);
            expect(error).toBeUndefined();
            done()
        });
    });
    it("returns status code OK and 0 affectedRows if theres nothing to update", function(done){
        const params = {
            ID_UNIT_TEST: Number.MAX_SAFE_INTEGER
        };
        api.put(consts.VALID_ENDPOINT, params, function(affectedRows, error){
            expect(affectedRows).toBe(0);
            expect(error).toBeUndefined();
            done()
        });
    });
    it("returns BAD_REQUEST if the primary key is missing and endpoint is valid", function(done){
        const params = {
            PROJNAME: validEntry.PROJNAME
        };
        api.put(consts.VALID_ENDPOINT, params, function(affectedRows, error){
            expect(affectedRows).toBeUndefined();
            expect(error).toBe(400);
            done()
        });
    });
    it("returns UNPROCESSABLE_ENTITY(422) for invalid parameters types", function(done){
        const params = {
            ID_UNIT_TEST: randomString(20)
        };
        api.put(consts.VALID_ENDPOINT, params, function(affectedRows, error){
            expect(affectedRows).toBeUndefined();
            expect(error).toBe(422);
            done()
        });
    });
});