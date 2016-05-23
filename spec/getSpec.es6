import * as consts from "./config";
import {api, randomString} from "./utils";


describe("Testing GET requests", function(){
    it("calls the callback", function(done){
        api.get(consts.VALID_ENDPOINT, undefined, undefined, function(data, error){
            done();
        });
    });
    describe("Valid endpoint", function(){
        it("returns status code OK with permission ", function(done){
            api.get(consts.VALID_ENDPOINT, undefined, undefined, function(data, error){
                expect(error).not.toBeDefined();
                expect(data.content.length).toBeGreaterThan(0);
                done();
            });
        });
        it("returns status code UNAUTHORIZED without permission ", function(done) {
            api.get(consts.UNAUTHORIZED_ENDPOINT, undefined, undefined, function (data, error) {
                expect(data).not.toBeDefined();
                expect(error).toBe(403);
                done();
            })
        });
    });
    describe("Invalid endpoint", function(){
        it("returns status code NOT_FOUND with parameters", function(done) {
            const mockParams = {
                PROJNAME: randomString(20),
                ABC: randomString(20)
            };
            api.get('INVALID_ENDPOINT', mockParams, undefined, function (data, error) {
                expect(data).toBeUndefined();
                expect(error).toBe(404);
                done();
            })
        });

        it("returns status code NOT_FOUND without parameters", function(done) {
            api.get('INVALID_ENDPOINT', undefined, undefined, function (data, error) {
                expect(data).toBeUndefined();
                expect(error).toBe(404);
                done();
            })
        });
    });
});
