# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by emailing **Naor.tedgi@gmail.com**. 

Please include the following information in your report:

- A description of the vulnerability
- Steps to reproduce the issue
- Potential impact of the vulnerability
- Any suggested fixes (if applicable)

**Please do not open a public issue for security vulnerabilities.**

We will acknowledge your email within 48 hours and aim to provide a detailed response within 5 business days. We will keep you informed about our progress throughout the resolution process.

## Security Best Practices

When using `express-body-parser-error-handler`, please follow these security best practices:

### 1. Configure Appropriate Body Size Limits

Always set reasonable size limits for body-parser to prevent denial-of-service attacks:

```js
const { urlencoded, json } = require('body-parser');
const bodyParserErrorHandler = require('express-body-parser-error-handler');

// Set appropriate limits based on your application needs
app.use(urlencoded({ extended: false, limit: '100kb' }));
app.use(json({ limit: '100kb' }));
app.use(bodyParserErrorHandler());
```

### 2. Avoid Exposing Sensitive Error Information

The default error handler provides detailed error messages. In production, consider customizing error messages to avoid exposing sensitive information:

```js
app.use(bodyParserErrorHandler({
  errorMessage: (err) => {
    if (process.env.NODE_ENV === 'production') {
      return 'Invalid request body';
    }
    return `Body Parser failed to parse request --> ${err.message}`;
  }
}));
```

### 3. Log Security Events

Use the `onError` callback to log security-relevant events for monitoring:

```js
app.use(bodyParserErrorHandler({
  onError: (err, req, res, next) => {
    // Log the error for security monitoring
    console.error('Body parser error:', {
      type: err.type,
      ip: req.ip,
      path: req.path,
      timestamp: new Date().toISOString()
    });
  }
}));
```

### 4. Keep Dependencies Updated

Regularly update this package and its dependencies to ensure you have the latest security patches:

```sh
npm update express-body-parser-error-handler
```

### 5. Input Validation

This middleware handles body-parser errors, but you should still implement additional input validation for your application logic to ensure data integrity and security.

## Disclosure Policy

When we receive a security vulnerability report, we will:

1. Confirm the vulnerability and determine its impact
2. Develop and test a fix
3. Release a patch as soon as possible
4. Credit the reporter (unless they wish to remain anonymous)
5. Publish a security advisory on GitHub

## Comments on This Policy

If you have suggestions on how this process could be improved, please submit a pull request or open an issue to discuss.
