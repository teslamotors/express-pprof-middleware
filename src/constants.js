const HEAP_FILE_PATH = '/tmp/heap.pb.gz';
const WALL_FILE_PATH = '/tmp/wall.pb.gz';
const HEAP_WEB_PATH = '/debug/pprof/heap';
const HEAP_STOP_PATH = '/debug/pprof/heap/stop';
const WALL_WEB_PATH = '/debug/pprof/wall';
const INTERVAL_BYTES = 512 * 1024;
const STACK_DEPTH = 64;

module.exports = {
    HEAP_FILE_PATH,
    WALL_FILE_PATH,
    HEAP_WEB_PATH,
    HEAP_STOP_PATH,
    WALL_WEB_PATH,
    INTERVAL_BYTES,
    STACK_DEPTH
}