# express-pprof-middleware
Express middleware that exposes pprof endpoints for easy profiling

## Installation
```
npm i -S express-pprof-middleware
```

## Support Profiles
* Heap 
* CPU (coming soon)

## Usage

```js
const pprof = require('express-pprof-middleware');

const app = express();
app.use(pprof);
```

### Getting a heap profile:
```
curl http://localhost:8000/debug/pprof/heap -o heap.pb.gz
```