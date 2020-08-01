# juno

👩‍🚀 Pretty logger for Node.

## Installation

```sh
yarn add juno-js
```

## Usage

```typescript
import { logger as baseLogger } from 'juno-js'

import { config } from '.'

const logger = baseLogger(config.nodeEnv)

logger().info('Hi 🧕')
```

## License

MIT © [103cuong](https://github.com/103cuong)
