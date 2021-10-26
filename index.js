const pprof = require('pprof');
const fs = require('fs');

const heapFilePath = '/tmp/heap.pb.gz';
const wallFilePath = '/tmp/wall.pb.gz'

const heapWebPath = '/debug/pprof/heap';
const wallWebPath = '/debug/pprof/wall';

// Heap Profiler
pprof.heap.start(512 * 1024, 64);

const middleware = async (req, res, next) => {
    switch(req.path) {
        case heapWebPath:
            try {
                await heap(heapFilePath);
            } catch (err) {
                res.status(500).send(err.message);
                return;
            }
            res.sendFile(heapFilePath);
            return;
        case wallWebPath:
            try {
                let millis = 5000;
                const secs = parseInt(req.query?.seconds, 10);
                if (!Number.isNaN(secs) && secs > 0) {
                    millis = secs * 1000;
                }
                await wall(wallFilePath, millis);
            } catch (err) {
                res.status(500).send(err.message);
                return;
            }
            res.sendFile(wallFilePath);
            return;
        default:
            break;
    }
    return next();
};

const heap = async (outPath) => {
    const profile = await pprof.heap.profile();
    const buf = await pprof.encode(profile);
    return new Promise((resolve, reject) => {
        fs.writeFile(outPath, buf, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const wall = async (outPath, durationMillis) => {
    const profile = await pprof.time.profile({
        durationMillis: durationMillis,
    });
    const buf = await pprof.encode(profile);
    return new Promise((resolve, reject) => {
        fs.writeFile(outPath, buf, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = middleware;