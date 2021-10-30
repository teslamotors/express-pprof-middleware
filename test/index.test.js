const { expect } = require('chai');

describe('module main file - index.js', () => {
    it('should call without error', () => {
      require('../index');
    });
});

describe('heap profile', () => {
  it('should be correctly created and called', async () => {
    const middleware = require('../index');
    expect(middleware).to.be.instanceof(Function);

    let heapFilePath = '';
    const req = { get: () => {}, path: '/debug/pprof/heap' };
    const res = { set: () => {}, sendFile: (file) => {heapFilePath = file} };

    await middleware(req, res, () => {});
    expect(heapFilePath).to.equal('/tmp/heap.pb.gz');
  });
});

describe('wall profile', () => {
  it('should be correctly created and called', async () => {
    const middleware = require('../index');
    expect(middleware).to.be.instanceof(Function);

    let wallFilePath = '';
    const req = { get: () => {}, path: '/debug/pprof/wall', query: {seconds: 1}};
    const res = { set: () => {}, sendFile: (file) => {wallFilePath = file} };

    await middleware(req, res, () => {});
    expect(wallFilePath).to.equal('/tmp/wall.pb.gz');
  });
});


describe('heap stop', () => {
  it('should be correctly created and called', async () => {
    const middleware = require('../index');
    expect(middleware).to.be.instanceof(Function);

    let sendResult = '';
    const req = { get: () => {}, path: '/debug/pprof/heap/stop'};
    const res = { set: () => {}, send: (msg) => {sendResult = msg} };

    await middleware(req, res, () => {});
    expect(sendResult).to.equal('');
  });
});
