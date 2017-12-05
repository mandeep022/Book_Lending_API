'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var bookinfoCtrlStub = {
  index: 'bookinfoCtrl.index',
  show: 'bookinfoCtrl.show',
  create: 'bookinfoCtrl.create',
  upsert: 'bookinfoCtrl.upsert',
  patch: 'bookinfoCtrl.patch',
  destroy: 'bookinfoCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var bookinfoIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './bookinfo.controller': bookinfoCtrlStub
});

describe('Bookinfo API Router:', function() {
  it('should return an express router instance', function() {
    bookinfoIndex.should.equal(routerStub);
  });

  describe('GET /api/bookinfos', function() {
    it('should route to bookinfo.controller.index', function() {
      routerStub.get
        .withArgs('/', 'bookinfoCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/bookinfos/:id', function() {
    it('should route to bookinfo.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'bookinfoCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/bookinfos', function() {
    it('should route to bookinfo.controller.create', function() {
      routerStub.post
        .withArgs('/', 'bookinfoCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/bookinfos/:id', function() {
    it('should route to bookinfo.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'bookinfoCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/bookinfos/:id', function() {
    it('should route to bookinfo.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'bookinfoCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/bookinfos/:id', function() {
    it('should route to bookinfo.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'bookinfoCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
