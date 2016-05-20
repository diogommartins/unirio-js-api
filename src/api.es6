import "babel-polyfill";

var rest = require("restler");
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
     * @typedef {Object} API~ResultObject
     * @property {Object[]} content
     * @property {number[]} subset
     * @property {string[]} fields
     */

    /**
     * Callback function to be called with the response
     * @callback API~getCallback
     * @param {API~ResultObject} [data]
     * @param {Object} [error]
     */

    /**
     * @param {string} path - The API endpoint to use for the request, for example 'ALUNOS'
     * @param {Object} [params] - The parameters for the request. A value of None sends the automatic API parameters
     * @param {undefined|string[]} fields - The return fields for the request. A value of None is equal do requesting ALL the fields
     * @param {API~getCallback} [callback]
     * @return {*}
     */
    get(path, params={}, fields=[], callback){
        const formatedURL = url.format({
            protocol: this._protocol,
            host: this.server.host,
            pathname: this.server.path + '/' + path,  // todo: usar algum modulo com urlPathJoin ou ta bom?
            query: this._parsePayload(params, fields)
        });

        rest.get(formatedURL)
            .on('success', (data, response) => callback(data))
            .on('fail', (data, response) => callback(undefined, response.statusCode));
    }

    /**
     * @callback API~postCallback
     * @param {number} [newId]
     * @param {Object} [error]
     */

    /**
     *
     * @param path
     * @param params
     * @param {API~postCallback}callback
     */
    post(path, params={}, callback){
        const formatedURL = url.format({
            protocol: this._protocol,
            host: this.server.host,
            pathname: this.server.path + '/' + path
        });

        const payload = Object.assign(params, {API_KEY: this._key});

        rest.postJson(formatedURL, payload)
            .on('success', (data, response) => callback(Number(response.headers.id)))
            .on('fail', (data, response) => callback(undefined, response.statusCode))
            .on('error', (error, response) => callback(response, error));
    }

    /**
     *
     * @param {string} name
     * @param {Object[]} data
     * @param {string[]} [fields]
     * @param {API~getCallback} callback
     */
    callProcedure(name, data, fields=[], callback){
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

        rest.postJson(formatedURL, params)
            .on('success', (data, response) => callback(data))
            .on('fail', (data, response) => callback(undefined, response.statusCode))
            .on('error', (error, response) => callback(response, error));

    }
    /**
     *
     * @param {Object} params
     * @param {string[]} [fields]
     * @return {Object}
     * @private
     */
    _parsePayload(params, fields){
        const payload = { API_KEY: this._key, FORMAT: 'JSON'};
        if (typeof fields !== 'undefined')
            payload.FIELDS = fields.join();

        return Object.assign(params, payload)
    }
}

Unirio.API = API;