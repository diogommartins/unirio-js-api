import * as consts from "./config";
import {api, randomString} from "./utils";


describe("Testing GET requests", function(){
    it("calls the callback", function(done){
        api.get(consts.VALID_ENDPOINT, undefined, undefined, function(data, error){
            done();
        });
    });
    describe("with valid endpoint", function(){
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
    describe("with invalid endpoint", function(){
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

describe("Testing getSingleResult", function(){
    describe("Valid endpoint", function(){
        it("without passing parameters, returns an object ", function(done){
            api.getSingleResult(consts.VALID_ENDPOINT, undefined, undefined, function(data, error){
                expect(typeof data).toBe('object');
                expect(error).toBeUndefined();
                done();
            });
        });

        it("passing valid parameters, returns an object", function(done){
            api.getSingleResult(consts.VALID_ENDPOINT, undefined, undefined, function(doc, error){
                expect(error).toBeUndefined();
                const params = {ID_UNIT_TEST: doc.ID_UNIT_TEST};

                api.getSingleResult(consts.VALID_ENDPOINT, params, undefined, function(data, error){
                    expect(error).toBeUndefined();
                    expect(doc).toEqual(data);
                    done();
                })
            });
        });
    })
});