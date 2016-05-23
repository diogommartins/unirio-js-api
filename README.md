# unirio-api

[![NPM](https://nodei.co/npm/unirio-api.png)](https://nodei.co/npm/unirio-api/)

NPM package that provides an api client for the API provided by the Universidade Federal do Estado do Rio de Janeiro (UNIRIO)
Please visit http://sistemas.unirio.br/api for further information.

## Installing

```
npm install unirio-api
```

## Testing

```
npm test
```

## Basic Usage

``` javascript
var Unirio = require('unirio-api');

var KEY = "1a404993f3175002c90738a4e46b1d12c06ddcc42f01ffbbaecf3285b98f34dc3ac0b9db9e07fdfbe0587c6ef14e5c92";

var api = new Unirio.API(KEY, Unirio.APIServers.PRODUCTION);

api.get('UNIT_TEST', undefined, undefined, function(data, error){
    if (typeof error === 'undefined'){
        // Do something with `data`
    }
});
```

## Methods

The public module interface for interacting with the API methods is as follows:

``` javascript
get(path, params={}, fields=[], callback)
```
* @param {string} path - The API endpoint to use for the request, for example 'ALUNOS'
* @param {Object} [params] - The parameters for the request. A value of None sends the automatic API parameters
* @param {string[]} [fields] - The return fields for the request. A value of None is equal do requesting ALL the fields
* @param {API~getCallback} callback - A callback to be performed after the response/error

``` javascript
post(path, params={}, callback)
```

* @param {string} path: The API endpoint to use for the request, for example 'ALUNOS'
* @param {Object} params: The parameters for the request. Should contain all the not-null attributes.
* @param {API~postCallback} callback - A callback to be performed after the response/error

``` javascript
put(path, params, callback)
```

* @param {string} path - The API endpoint to use for the request, for example 'ALUNOS'
* @param {Object} params - The parameters for the request. Should contain all the attributes that should be updated as well as the endpoint unique identifier.
* @param {API~changeCallback} callback

``` javascript
del(path, params, callback)
```
* @param {string} path - The API endpoint to use for the request, for example 'ALUNOS'
* @param {Object} params - The parameters for the request. Should contain the endpoint unique identifier. e.g.: `{'ID_ALUNO': 235}`
* @param {API~changeCallback} callback

``` javascript
callProcedure(name, data, fields=[], callback)
```

* @param {string} name - Procedure name to be called
* @param {Object[]} data - Array of objects to be serialized
* @param {string[]} [fields] - Array with de desired return fields. Empty list or None will return all
* @param {API~getCallback} callback - A callback to be performed after the response/error


## To do

* Improve test coverage
* Implement caching integration
* Callbacks documentation