import {TEST_ENV} from './config';

var request = require('request');
var url = require("url");

var baseTestingURL = url.format({
    protocol: 'http',
    host: TEST_ENV.host
});

describe(`Checking if hostname "${baseTestingURL}" is up`, function(){
    it("returns status code 200", function(done){
        request.get(baseTestingURL, function(error, response, body){
            expect(response.statusCode).toBe(200);
            done();
        })
    });
});