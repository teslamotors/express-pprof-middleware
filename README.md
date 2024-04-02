# express-pprof-middleware
Express middleware that exposes pprof endpoints for easy profiling

## Installation
```
npm i -S express-pprof-middleware
```

## Supported Profiles
* Heap 
* Wall Time

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

### Getting a wall time profile:
```
curl http://localhost:8000/debug/pprof/wall?seconds=5 -o wall.pb.gz
```

## Viewing Profiles
Full details on the pprof tool here: https://github.com/google/pprof
### Installing pprof:
```
go install github.com/google/pprof@latest
```

### Viewing a profile in graph format:
```
pprof -web heap.gz
```

### Viewing on an interactive web interface:
```
pprof -http=":" heap.gz
```