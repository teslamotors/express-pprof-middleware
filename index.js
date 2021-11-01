const pprof = require('pprof');
const fs = require('fs');

const heapFilePath = '/tmp/heap.pb.gz';
const wallFilePath = '/tmp/wall.pb.gz'

const heapWebPath = '/debug/pprof/heap';
const heapStopPath = '/debug/pprof/heap/stop';
const wallWebPath = '/debug/pprof/wall';

const intervalBytes = 512 * 1024;
const stackDepth = 64;

// Start Heap Profiler
pprof.heap.start(intervalBytes, stackDepth);

/**
 * @param  {Object} req
 * @param  {Object} res
 * @param  {Function} next
 */
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
                if (req.query.seconds) {
                    const secs = parseInt(req.query.seconds, 10);
                    if (!Number.isNaN(secs) && secs > 0) {
                        millis = secs * 1000;
                    }
                }
                await wall(wallFilePath, millis);
            } catch (err) {
                res.status(500).send(err.message);
                return;
            }
            res.sendFile(wallFilePath);
            return;
        case heapStopPath:
            try {
                pprof.heap.stop();
                res.send('');
            } catch (err) {
                res.status(500).send(err.message);
                return;
            }
            return;
        default:
            break;
    }
    next();
};

/**
 * @param  {string} outPath - output path for the heap protobuf output
 */
const heap = async (outPath) => {
    try {
        pprof.heap.start(intervalBytes, stackDepth);
    } catch {}
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

/**
 * @param  {string} outPath - output path for the heap protobuf output
 * @param  {number} durationMillis - sampling duration
 */
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