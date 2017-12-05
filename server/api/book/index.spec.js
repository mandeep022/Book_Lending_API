'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var bookCtrlStub = {
  index: 'bookCtrl.index',
  show: 'bookCtrl.show',
  create: 'bookCtrl.create',
  upsert: 'bookCtrl.upsert',
  patch: 'bookCtrl.patch',
  destroy: 'bookCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var bookIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './book.controller': bookCtrlStub
});

describe('Book API Router:', function() {
  it('should return an express router instance', function() {
    bookIndex.should.equal(routerStub);
  });

  describe('GET /api/books', function() {
    it('should route to book.controller.index', function() {
      routerStub.get
        .withArgs('/', 'bookCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/books/:id', function() {
    it('should route to book.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'bookCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/books', function() {
    it('should route to book.controller.create', function() {
      routerStub.post
        .withArgs('/', 'bookCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/books/:id', function() {
    it('should route to book.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'bookCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/books/:id', function() {
    it('should route to book.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'bookCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/books/:id', function() {
    it('should route to book.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'bookCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
