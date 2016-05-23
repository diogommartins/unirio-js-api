import "babel-polyfill";

var rest = require("restler");
var url = require("url");

rest.delJson = function (url, data, options) {
    return rest.json(url, data, options, 'DELETE');
};

export const Unirio = {};

export const APIServers = Unirio.APIServers = {
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

export class API{
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
     * @param {number} [error]
     */

    /**
     * @param {string} path - The API endpoint to use for the request, for example 'ALUNOS'
     * @param {Object} [params] - The parameters for the request. A value of None sends the automatic API parameters
     * @param {string[]} [fields] - The return fields for the request. A value of None is equal do requesting ALL the fields
     * @param {API~getCallback} callback
     */
    get(path, params={}, fields=[], callback){
        const formatedURL = this._formatURL(path, {query: this._parsePayload(params, fields)});

        rest.get(formatedURL)
            .on('success', (data, response) => callback(data))
            .on('fail', (data, response) => callback(undefined, response.statusCode));
    }

    /**
     * Callback function to be called with the response
     * @callback API~getSingleCallback
     * @param {Object} [doc]
     * @param {number} [error]
     */

    /**
     * Wrapper to get a single result
     *
     * @param {string} path - The API endpoint to use for the request, for example 'ALUNOS'
     * @param {Object} [params] - The parameters for the request. A value of None sends the automatic API parameters
     * @param {string[]} [fields] - The return fields for the request. A value of None is equal do requesting ALL the fields
     * @param {API~getSingleCallback} callback
     */
    getSingleResult(path, params={}, fields=[], callback){
        const _params = {LMIN: 0, LMAX: 1};
        Object.assign(_params, params);

        this.get(path, _params, fields, function(data, error){
            (typeof error === 'undefined') ? callback(data.content[0]) : callback(undefined, error);
        });
    }

    /**
     * @callback API~postCallback
     * @param {number} [newId]
     * @param {Object} [error]
     */

    /**
     *
     * @param {string} path - The API endpoint to use for the request, for example 'ALUNOS'
     * @param {Object} params - The parameters for the request. Should contain all the not-null attributes.
     * @param {API~postCallback}callback - A callback to be performed after the response/error
     */
    post(path, params={}, callback){
        const payload = Object.assign(params, {API_KEY: this._key});

        rest.postJson(this._formatURL(path), payload)
            .on('success', (data, response) => callback(Number(response.headers.id)))
            .on('fail', (data, response) => callback(undefined, response.statusCode))
            .on('error', (error, response) => callback(response, error));
    }

    /**
     * @callback API~changeCallback
     * @param {number} [afectedRows]
     * @param {number} [error] - HTTP Status code
     */

    /**
     *
     * @param {string} path - The API endpoint to use for the request, for example 'ALUNOS'
     * @param {Object} params - The parameters for the request. Should contain all the attributes that should be updated as well as the endpoint unique identifier.
     * @param {API~changeCallback} callback
     */
    put(path, params, callback) {
        const payload = Object.assign(params, {API_KEY: this._key});

        rest.putJson(this._formatURL(path), payload)
            .on('success', (data, response) => callback(Number(response.headers.affected)) )
            .on('fail', (data, response) => callback(undefined, response.statusCode))
    }

    /**
     *
     * @param {string} path - The API endpoint to use for the request, for example 'ALUNOS'
     * @param {Object} params - The parameters for the request. Should contain the endpoint unique identifier. e.g.: `{'ID_ALUNO': 235}`
     * @param {API~changeCallback} callback
     */
    del(path, params, callback){
        const payload = Object.assign(params, {API_KEY: this._key});
        
        rest.delJson(this._formatURL(path), payload)
            .on('200', (data, response) => callback(Number(response.headers.affected)) )
            .on('fail', (data, response) => callback(undefined, response.statusCode) )
            .on('204', (data, response) => callback(undefined, response.statusCode) )
    }

    /**
     *
     * @param {string} name - Procedure name to be called
     * @param {Object[]} data - List of objects to be serialized
     * @param {string[]} [fields] - list with de desired return fields. Empty list or None will return all
     * @param {API~getCallback} callback - A callback to be performed after the response/error
     */
    callProcedure(name, data, fields=[], callback){
        const path = 'procedure/' + name;
        const params = {
            data: data,
            async: false,
            fields: fields,
            API_KEY: this._key
        };
        
        rest.postJson(this._formatURL(path), params)
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

    /**
     *
     * @param path
     * @param {Object} [options] - Object with aditional params to be passed to url.format
     * @returns {*}
     * @private
     */
    _formatURL(path, options){
        const baseURL = {
            protocol: this._protocol,
            host: this.server.host,
            pathname: this.server.path + '/' + path
        };
        if (typeof options !== 'undefined')
            Object.assign(baseURL, options);

        return url.format(baseURL);
    }
}

Unirio.API = API;