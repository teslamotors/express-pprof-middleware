const fs = require('fs');
const { HEAP_FILE_PATH, INTERVAL_BYTES, STACK_DEPTH } = require('./constants');

/**
 * @param  {Object} pprof - The pprof instance
 */
const heap = async (pprof) => {
	try {
		pprof.heap.start(INTERVAL_BYTES, STACK_DEPTH);
	} catch { }
	const profile = await pprof.heap.profile();
	const buf = await pprof.encode(profile);
	return new Promise((resolve, reject) => {
		fs.writeFile(HEAP_FILE_PATH, buf, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(HEAP_FILE_PATH);
			}
		});
	});
};

module.exports = heap;
