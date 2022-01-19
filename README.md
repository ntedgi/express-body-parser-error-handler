# express-body-parser-error-handler
middleware to be set right after body parser in order to handle all body parser errors and return 4xx responses to the client

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Node.js CI](https://github.com/ntedgi/express-body-parser-error-handler/actions/workflows/tests.js.yml/badge.svg)](https://github.com/ntedgi/express-body-parser-error-handler/actions/workflows/tests.js.yml) [![Coverage Status](https://coveralls.io/repos/github/ntedgi/express-body-parser-error-handler/badge.svg?branch=main)](https://coveralls.io/github/ntedgi/express-body-parser-error-handler?branch=main) [![Build Status](https://app.travis-ci.com/ntedgi/express-body-parser-error-handler.svg?branch=main)](https://app.travis-ci.com/ntedgi/express-body-parser-error-handler)
## About
99.9% of the time your going to use body parser on your express server application , even if your going to use express.json,raw,text or urlencoded under the hood it also uses body parser [express source code](https://github.com/expressjs/express/blob/master/lib/express.js#L78)


There’re multiple kinds of errors raised by body-parser.
They involve sending bad headers or data that are not accepted by it, or canceling requests before all the data is read.
Various 400 series error status codes will be sent as the response along with the corresponding error messages and stack trace
the problem is when errors thrown from this middleware you need to handle them by yourself and all errors thrown from body parser are usually 4xx errors caused by client

for example:


| Type   |      Code      |  description |
|----------|:-------------:|------:|
|encoding.unsupported|415|content encoding unsupported|
|entity.parse.failed|400| |
|entity.verify.failed|403| |
|request.aborted|400 |request is aborted by the client before reading the body has finished|
|request.size.invalid|400|request size did not match content length|
|stream.encoding.set|500|stream encoding should not be set|
|parameters.too.many|413| |
|charset.unsupported|415| unsupported charset “BOGUS”|
|encoding.unsupported|415|unsupported content encoding “bogus”|
|entity.too.large|413| |

use this package if you don't want to handle them yourself :-)

## Install
```sh
$ npm i express-body-parser-error-handler
```


## Example
```js
 request(app)
        .post('/')
        .set('Content-Type', 'application/json')
        .send('{ email: \'email\', password: \'password\'')  //  <==== missing "}"  - invalid json   
        .expect(400, function (err, res) {
          expect(JSON.parse(res.text).message).to.equal(
   ====>        'Body Parser failed to parse request --> Unexpected token e in JSON at position 2'
          )
        })
```


## Usage Example

```js
const bodyParserErrorHandler = require('express-body-parser-error-handler')
const { urlencoded, json } = require('body-parser')
const express = require('express')
const app = express();
router.route('/').get(function (req, res) {
    return res.json({message:"🚀"});
});

// body parser initilization
app.use(urlencoded({extended: false, limit: '250kb'}));
app.use('/', json({limit: '250kb'}));

// body parser error handler
app.use(bodyParserErrorHandler());
app.use(router);
...
```
## Configuration

**onError** - function(err, req, res) => { } 

Custom on error callback  useful if you want to log the error message or send metrics
```js
app.use(bodyParserErrorHandler({
    onError = (err, req, res) => {
        ...
    }
}))
```

**errorMessage** - function(err) => { }

default:

```js
errorMessage = (err) => {
    return `Body Parser failed to parse request --> ${err.message}`
}
```

```js
app.use(bodyParserErrorHandler({
    errorMessage = (err) => {
        ...
    }
}))
```





## License 
MIT © 
---
```ts
if (this.repo.isAwesome || this.repo.isHelpful) {
  Star(this.repo);
}
```
