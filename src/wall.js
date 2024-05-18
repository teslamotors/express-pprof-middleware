const fs = require('fs');
const { WALL_FILE_PATH } = require('./constants');

/**
 * @param  {number} durationMillis - sampling duration
 * @param  {Object} pprof - The pprof instance
 */
const wall = async (durationMillis, pprof) => {
	const profile = await pprof.time.profile({
		durationMillis,
	});
	const buf = await pprof.encode(profile);
	return new Promise((resolve, reject) => {
		fs.writeFile(WALL_FILE_PATH, buf, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(WALL_FILE_PATH);
			}
		});
	});
};

module.exports = wall;
