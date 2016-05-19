import "babel-polyfill";

var request = require("request");
var url = require("url");

export const Unirio = {};

Unirio.APIServers = {
    PRODUCTION: {
        host: "sistemas.unirio.br",
        path: "/api"
    },
    DEVELOPMENT: {
        host: "teste.sistemas.unirio.br",
        path: "/api"
    },
    LOCAL: {
        host: "localhost:8000",
        path: "/api"
    },
    PRODUCTION_DEVELOPMENT: {
        host: "sistemas.unirio.br",
        path: "/api_teste"
    }
};

class API{
    /**
     *
     * @param {string} key - A valid APIKey that will be used for future requests
     * @param {Object} server - An APIServer that identify the host and path to be used as base for the requests
     * @param {boolean} secure - http or https ?
     */
    constructor(key, server=Unirio.APIServers.LOCAL, secure=false){
        this._key = key;
        this.server = server;
        this._protocol = secure ? 'https': 'http';
    }

    /**
     *
     * @typedef {Object} API~APIResultObject
     * @property {Object[]} content
     * @property {number[]} subset
     * @property {string[]} fields
     */

    /**
     * Callback function to be called with the response
     * @callback API~requestCallback
     * @param {API~APIResultObject} [data]
     * @param {Object} [error]
     */

    /**
     * @param {string} path - The API endpoint to use for the request, for example 'ALUNOS'
     * @param {Object} [params] - The parameters for the request. A value of None sends the automatic API parameters
     * @param {undefined|string[]} fields - The return fields for the request. A value of None is equal do requesting ALL the fields
     * @param {API~requestCallback} [callback]
     * @return {*}
     */
    get(path, params={}, fields=[], callback){
        const formatedURL = url.format({
            protocol: this._protocol,
            host: this.server.host,
            pathname: this.server.path + '/' + path,  // todo: usar algum modulo com urlPathJoin ou ta bom?
            query: this._parsePayload(params, fields)
        });

        request.get(formatedURL, function(error, response, body){
            if (typeof callback === 'function') {
                if (!error && response.statusCode === 200) {
                    callback(JSON.parse(body));
                }
                else {
                    callback(undefined, response.statusCode);
                }
            }
        });
    }
    call_procedure(name, data, fields=[], callback){
        const formatedURL = url.format({
            protocol: this._protocol,
            host: this.server.host,
            pathname: this.server.path + '/procedure/' + name
        });

        const params = {
            data: data,
            async: false,
            fields: fields,
            API_KEY: this._key
        };

        request.post({uri:formatedURL, body:params, json:true}, function(error, response, body){
            if (typeof callback === 'function') {
                if (!error && (response.statusCode === 201 || response.statusCode === 200)) {
                    callback(JSON.parse(body));
                }
                else{
                    callback(undefined, response.statusCode);
                }
            }
        });
        
    }
    /**
     *
     * @param {Object} params
     * @param {string[]} fields
     * @return {Object}
     * @private
     */
    _parsePayload(params, fields){
        return Object.assign(params, {
            FIELDS: fields.join(),
            API_KEY: this._key,
            FORMAT: 'JSON'
        })
    }
}

Unirio.API = API;