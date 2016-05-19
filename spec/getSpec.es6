import {Unirio} from "../lib/api";
import {API_KEY_VALID, API_KEY_INVALID, VALID_ENDPOINT, UNAUTHORIZED_PROCEDURE} from "./config";


var api = new Unirio.API(API_KEY_VALID);

describe("Testing GET requests", function(){
    it("calls the callback", function(done){
        api.get(VALID_ENDPOINT, undefined, undefined, function(data, error){
            done();
        });
    });
    describe("Valid endpoint", function(){
        it("returns status code OK with permission ", function(done){
            api.get(VALID_ENDPOINT, undefined, undefined, function(data, error){
                expect(error).not.toBeDefined();
                expect(data.content.length).toBeGreaterThan(0);
                done();
            });
        });
        it("returns status code UNAUTHORIZED without permission ", function(done) {
            api.get('ALUNOS', undefined, undefined, function (data, error) {
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

describe("Testint Procedure requestes", function(){
    it("responds to procedure calls", function(done){
        api.call_procedure(UNAUTHORIZED_PROCEDURE, [], undefined, function(data, error){
            expect(error).toBe(401);
            done();
        });
    });
    it("returns valid data", function(done){
        const dataset = [{ID_DOCUMENTO: 217, COD_OPERADOR: 9999}];
        api.call_procedure('TramitacoesComoGrafo', dataset, undefined, function(data, error){
            expect(error).toBe(undefined);
            expect(data).toBeDefined();
        });
    });
});