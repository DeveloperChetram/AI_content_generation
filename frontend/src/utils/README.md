# Logger Utility

This utility provides conditional logging that automatically removes console statements in production builds.

## Usage

Instead of using `console.log()` directly, use the logger utility:

```javascript
import logger from './utils/logger.js';

// These will only log in development
logger.log('Debug message');
logger.warn('Warning message');
logger.error('Error message');
logger.info('Info message');
logger.debug('Debug message');
logger.trace('Trace message');
```

## Features

- **Development Only**: All logging is automatically disabled in production
- **Multiple Log Levels**: Supports log, warn, error, info, debug, and trace
- **Automatic Removal**: Console statements are stripped during build process
- **Zero Runtime Overhead**: In production, these calls have no performance impact

## Migration

Replace existing console statements:

```javascript
// Before
console.log('User logged in');
console.error('API Error:', error);

// After
import logger from './utils/logger.js';
logger.log('User logged in');
logger.error('API Error:', error);
```

## Build Configuration

The build process automatically:
1. Removes all console statements using Terser
2. Strips console calls using custom Vite plugin
3. Only keeps logging in development mode
