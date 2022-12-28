function isBodyParserError (error) {
  const bodyParserCommonErrorsTypes = [
    'encoding.unsupported',
    'entity.parse.failed',
    'entity.verify.failed',
    'request.aborted',
    'request.size.invalid',
    'stream.encoding.set',
    'parameters.too.many',
    'charset.unsupported',
    'entity.too.large'
  ]
  return bodyParserCommonErrorsTypes.includes(error.type)
}

function bodyParserErrorHandler (
  {
    // eslint-disable-next-line
        onError = (err, req, res) => {
    },
    errorMessage = (err) => {
      return `Body Parser failed to parse request --> ${err.message}`
    }
  } = {}) {
  return (err, req, res, next) => {
    if (err && isBodyParserError(err)) {
      onError(err, req, res)
      res.status(err.status)
      res.send({ message: errorMessage(err) })
    } else next(err)
  }
}

module.exports = bodyParserErrorHandler
