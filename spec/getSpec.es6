import {Unirio} from "../lib/api";
import * as consts from "./config";


var api = new Unirio.API(consts.KEYS.VALID.PRODUCTION, consts.TEST_EjNV);

function randomString(length){
    return Math.random().toString(length).slice(2);
}

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
            api.get('INVALID_ENDPOINT', undefined, undefined, function (data, error) {
                expect(data).not.toBeDefined();
                expect(error).toBe(404);
                done();
            })
        });
    });
});

describe("Testing Procedure requests", function(){
    it("responds to procedure calls", function(done){
        api.callProcedure(consts.UNAUTHORIZED_PROCEDURE, [], undefined, function(data, error){
            expect(error).toBe(401);
            done();
        });
    });
    it("returns valid data", function(done){
        const dataset = [{ID_DOCUMENTO: 184158, COD_OPERADOR: 9999}];
        api.callProcedure('TramitacoesComoGrafo', dataset, undefined, function(data, error){
            expect(error).toBeUndefined();
            expect(data).toBeDefined();
            done();
        });
    });
});

describe("Testing POST requests", function(){
    var requiredFields = ['PROJNO', 'PROJNAME', 'DEPTNO', 'RESPEMP', 'MAJPROJ', 'COD_OPERADOR'];
    var mockEntry = {};

    beforeEach(() => requiredFields.forEach(field => mockEntry[field] = randomString(20)));

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
        validEntry['PROJNAME'] = randomString(30);
        api.put(consts.VALID_ENDPOINT, validEntry, function(affectedRows, error){

        });
    });
    it("returns status code NOT_FOUND if theres nothing to update", function(done){

    });
    it("returns BAD_REQUEST if the primary key is missing and endpoint is valid", function(done){

    });
    it("returns UNPROCESSABLE_ENTITY(422) for invalid parameters types", function(done){

    });
});

describe("Testing DELETE requests", function(){
   it("returns status code OK with permission", function(done){

   });
   it("", function(done){

   });
});