const { expect } = require('chai');
const os = require('os');
const path = require('path');

const expectedHeapPath = path.join(os.tmpdir(), 'heap.pb.gz');
const expectedWallPath = path.join(os.tmpdir(), 'wall.pb.gz');

const createMockResponse = () => {
  const res = {
    statusCode: 200,
    headers: {},
    sentFile: '',
    sentData: null,
    headersSent: false,
    status(code) {
      this.statusCode = code;
      return this;
    },
    set(header, value) {
      this.headers[header] = value;
      return this;
    },
    send(data) {
      this.sentData = data;
      this.headersSent = true;
      return this;
    },
    sendFile(file, cb) {
      this.sentFile = file;
      this.headersSent = true;
      if (typeof cb === 'function') {
        cb(null);
      }
      return this;
    },
  };
  return res;
};

describe('module main file - index.js', () => {
  it('should call without error', () => {
    // eslint-disable-next-line global-require
    require('../index');
  });
});

describe('heap profile', () => {
  it('should be correctly created and called', async () => {
    // eslint-disable-next-line global-require
    const middleware = require('../index');
    expect(middleware).to.be.instanceof(Function);

    const req = { get: () => {}, path: '/debug/pprof/heap' };
    const res = createMockResponse();

    await middleware(req, res, () => {});
    expect(res.sentFile).to.equal(expectedHeapPath);
  });
});

describe('wall profile', function suite() {
  this.timeout(15000);

  it('should be correctly created and called with query params', async () => {
    // eslint-disable-next-line global-require
    const middleware = require('../index');
    expect(middleware).to.be.instanceof(Function);

    const req = { get: () => {}, path: '/debug/pprof/wall', query: { seconds: 1 } };
    const res = createMockResponse();

    await middleware(req, res, () => {});
    expect(res.sentFile).to.equal(expectedWallPath);
  });

  it('should handle request when query is undefined', async () => {
    // eslint-disable-next-line global-require
    const middleware = require('../index');
    const req = { get: () => {}, path: '/debug/pprof/wall' };
    const res = createMockResponse();

    await middleware(req, res, () => {});
    expect(res.sentFile).to.equal(expectedWallPath);
  });

  it('should fallback to default when seconds query is non-numeric or non-positive', async () => {
    // eslint-disable-next-line global-require
    const middleware = require('../index');
    const req = { get: () => {}, path: '/debug/pprof/wall', query: { seconds: 'invalid' } };
    const res = createMockResponse();

    await middleware(req, res, () => {});
    expect(res.sentFile).to.equal(expectedWallPath);
  });
});

describe('heap stop', () => {
  it('should be correctly created and called', async () => {
    // eslint-disable-next-line global-require
    const middleware = require('../index');
    expect(middleware).to.be.instanceof(Function);

    const req = { get: () => {}, path: '/debug/pprof/heap/stop' };
    const res = createMockResponse();

    await middleware(req, res, () => {});
    expect(res.sentData).to.equal('');
  });
});

describe('unmatched path', () => {
  it('should call next() for unmatched routes', async () => {
    // eslint-disable-next-line global-require
    const middleware = require('../index');
    let nextCalled = false;
    const req = { get: () => {}, path: '/api/v1/users' };
    const res = createMockResponse();

    await middleware(req, res, () => {
      nextCalled = true;
    });
    expect(nextCalled).to.equal(true);
  });
});
