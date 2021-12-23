# express-body-parser-error-handler
middleware to be set right after body parser in order to handle body parser errors and return 4xx responses to the client

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## About
99.9% of the time your going to use body parser on your express server application There’re multiple kinds of errors raised by body-parser.
They involve sending bad headers or data that are not accepted by it, or canceling requests before all the data is read.
Various 400 series error status codes will be sent as the response along with the corresponding error messages and stack trace
the problem is when errors thrown from this middleware you need to handle them by yourself and all errors thrown from body parser are usually 4xx errors caused by client

for example:

- 'encoding.unsupported'
- 'entity.parse.failed',
- 'entity.verify.failed',
- 'request.aborted',
- 'request.size.invalid',
- 'stream.encoding.set',
- 'parameters.too.many',
- 'charset.unsupported',
- 'encoding.unsupported',
- 'entity.too.large'

use this package if you don't want to handle them yourself :-)

## Example

```js
const bodyParserErrorHandler = require('express-body-parser-error-handler')
const { urlencoded, json } = require('body-parser')
const express = require('express')
const app = express();
router.route('/').get(function (req, res) {
    return res.json({message:"🚀"});
});

// body parser initilization
app.use(urlencoded({extended: false, limit: defaultLimitSize}));
app.use('/', json({limit: '250'}));

// body parser error handler
app.use(bodyParserErrorHandler());
app.use(router);
...
```

#### Custom on error callback
useful if you want to log the error message or send metrics
```js
app.use(bodyParserErrorHandler({
    onError = (err, req, res) => {
        ...
    }
}))
```

#### Custom errorMessage

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