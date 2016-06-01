import * as consts from "./config";
import {api, randomString} from "./utils";


describe("Testing POST requests", function(){
    var requiredFields = ['PROJNO', 'PROJNAME', 'DEPTNO', 'RESPEMP', 'MAJPROJ', 'COD_OPERADOR'];
    var mockEntry = {};

    beforeEach(() => requiredFields.forEach(field => mockEntry[field] = randomString(10)));

    afterEach(() => mockEntry = {});

    it("returns status CREATED with permission and valid parameters", function(done){
        api.post(consts.VALID_ENDPOINT, mockEntry, function(newId, error){
            expect(error).toBeUndefined();
            expect(newId).toBeGreaterThan(0);
            done();
        });
    });

    it("returns status CREATED with blob field", function(done){
        console.warn('Not implemented');
        done();
    });

    it("returns status CREATED with clob field", function(done){
        console.warn('Not implemented');
        done();
    });

    it("returns BAD_REQUEST with permission and empty parameters", function(done){
        api.post(consts.VALID_ENDPOINT, undefined, function(newId, error){
            expect(error).toBe(400);
            expect(newId).toBeUndefined();
            done();
        });
    });

    it("returns BAD_REQUEST with permission and invalid parameters", function(done){
        const invalidParams = {
            'FAKE_FIELD1': randomString(20),
            'FAKE_FIELD2': randomString(20)
        };

        api.post(consts.VALID_ENDPOINT, invalidParams, function(newId, error){
            expect(error).toBe(400);
            expect(newId).toBeUndefined();
            done();
        });
    });
});