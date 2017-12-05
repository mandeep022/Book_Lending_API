'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newBookinfo;

describe('Bookinfo API:', function() {
  describe('GET /api/bookinfos', function() {
    var bookinfos;

    beforeEach(function(done) {
      request(app)
        .get('/api/bookinfos')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          bookinfos = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      bookinfos.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/bookinfos', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/bookinfos')
        .send({
          name: 'New Bookinfo',
          info: 'This is the brand new bookinfo!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newBookinfo = res.body;
          done();
        });
    });

    it('should respond with the newly created bookinfo', function() {
      newBookinfo.name.should.equal('New Bookinfo');
      newBookinfo.info.should.equal('This is the brand new bookinfo!!!');
    });
  });

  describe('GET /api/bookinfos/:id', function() {
    var bookinfo;

    beforeEach(function(done) {
      request(app)
        .get(`/api/bookinfos/${newBookinfo._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          bookinfo = res.body;
          done();
        });
    });

    afterEach(function() {
      bookinfo = {};
    });

    it('should respond with the requested bookinfo', function() {
      bookinfo.name.should.equal('New Bookinfo');
      bookinfo.info.should.equal('This is the brand new bookinfo!!!');
    });
  });

  describe('PUT /api/bookinfos/:id', function() {
    var updatedBookinfo;

    beforeEach(function(done) {
      request(app)
        .put(`/api/bookinfos/${newBookinfo._id}`)
        .send({
          name: 'Updated Bookinfo',
          info: 'This is the updated bookinfo!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedBookinfo = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBookinfo = {};
    });

    it('should respond with the updated bookinfo', function() {
      updatedBookinfo.name.should.equal('Updated Bookinfo');
      updatedBookinfo.info.should.equal('This is the updated bookinfo!!!');
    });

    it('should respond with the updated bookinfo on a subsequent GET', function(done) {
      request(app)
        .get(`/api/bookinfos/${newBookinfo._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let bookinfo = res.body;

          bookinfo.name.should.equal('Updated Bookinfo');
          bookinfo.info.should.equal('This is the updated bookinfo!!!');

          done();
        });
    });
  });

  describe('PATCH /api/bookinfos/:id', function() {
    var patchedBookinfo;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/bookinfos/${newBookinfo._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Bookinfo' },
          { op: 'replace', path: '/info', value: 'This is the patched bookinfo!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedBookinfo = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedBookinfo = {};
    });

    it('should respond with the patched bookinfo', function() {
      patchedBookinfo.name.should.equal('Patched Bookinfo');
      patchedBookinfo.info.should.equal('This is the patched bookinfo!!!');
    });
  });

  describe('DELETE /api/bookinfos/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/bookinfos/${newBookinfo._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when bookinfo does not exist', function(done) {
      request(app)
        .delete(`/api/bookinfos/${newBookinfo._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
