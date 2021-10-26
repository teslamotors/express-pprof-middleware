const pprof = require('pprof');
const fs = require('fs');

const heapOut = '/tmp/heap.pb.gz';
const heapPath = '/debug/pprof/heap';

// Heap Profiler
pprof.heap.start(512 * 1024, 64);

const middleware = async (req, res, next) => {
    if (req.path === heapPath) {
        try {
            await heap();
        } catch (err) {
            res.status(500).send(err.message);
            return;
        }
        res.sendFile(heapOut);
        return;
    }
    return next();
};

const heap = async () => {
    const profile = await pprof.heap.profile();
    const buf = await pprof.encode(profile);
    return new Promise((resolve, reject) => {
        fs.writeFile(heapOut, buf, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })
};


module.exports = middleware;