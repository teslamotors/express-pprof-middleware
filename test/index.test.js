const assert = require('assert');
const { expect } = require('chai');

describe('module main file - index.js', () => {
    it('should call without error', () => {
      require('../index');
    });
});

describe('heap - index.js', () => {
  it('should be correctly created and called', (done) => {
    const middleware = require('../index');
    expect(middleware).to.be.instanceof(Function);
    const req = { get: () => {path: '/debug/pprof/heap'} };
    const res = { set: () => {} };

    middleware(req, res, done);
  });
});