const pprof = require('pprof');
const heap = require('./heap');
const wall = require('./wall');
const { 
  HEAP_WEB_PATH,
  HEAP_STOP_PATH, 
  WALL_WEB_PATH, 
  INTERVAL_BYTES, 
  STACK_DEPTH 
} = require('./constants');

// Start Heap Profiler
pprof.heap.start(INTERVAL_BYTES, STACK_DEPTH);

/**
 * @param  {Object} req
 * @param  {Object} res
 * @param  {Function} next
 */
const middleware = async (req, res, next) => {
  switch (req.path) {
    case HEAP_WEB_PATH:
      try {
        const response = await heap(pprof);
        return res.sendFile(response);
      } catch (err) {
        return res.status(500).send(err.message);
      }
    case WALL_WEB_PATH:
      try {
        let millis = 5000;
        if (req.query.seconds) {
          const secs = parseInt(req.query.seconds, 10);
          if (!Number.isNaN(secs) && secs > 0) {
            millis = secs * 1000;
          }
        }
        const response = await wall(millis, pprof);
        return res.sendFile(response);
      } catch (err) {
        return res.status(500).send(err.message);
      }
    case HEAP_STOP_PATH:
      try {
        pprof.heap.stop();
        return res.send('');
      } catch (err) {
        return res.status(500).send(err.message);
      }
    default:
      return next();
  }
};

module.exports = middleware;
