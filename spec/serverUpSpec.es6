import {TEST_ENV} from './config';

var rest = require('restler');
var url = require("url");

var baseTestingURL = url.format({
    protocol: 'http',
    host: TEST_ENV.host
});

describe(`Checking if hostname "${baseTestingURL}" is up`, function(){
    it("returns status code 200", function(done){
        rest.get(baseTestingURL).on('success', function(data, response){
            expect(response.statusCode).toBe(200);
            done();
        })
    });
});