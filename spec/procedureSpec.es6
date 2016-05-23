import * as consts from "./config";
import {api} from "./utils";


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
