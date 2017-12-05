/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/bookinfos              ->  index
 * POST    /api/bookinfos              ->  create
 * GET     /api/bookinfos/:id          ->  show
 * PUT     /api/bookinfos/:id          ->  upsert
 * PATCH   /api/bookinfos/:id          ->  patch
 * DELETE  /api/bookinfos/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Bookinfo from './bookinfo.model';
import User from '../user/user.model';
var cron = require('node-cron');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Bookinfos
export function index(req, res) {
  return Bookinfo.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Bookinfo from the DB
export function show(req, res) {
  return Bookinfo.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Bookinfo in the DB
export function create(req, res) {
  return Bookinfo.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Bookinfo in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Bookinfo.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Bookinfo in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Bookinfo.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Bookinfo from the DB
export function destroy(req, res) {
  return Bookinfo.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

//checks whether a user subscription is expired or still active
cron.schedule('* */23 * * *', function(){
  let date = new Date();
  let lastMidnight = date.setUTCHours(0, 0, 0, 0);
  console.log('lastMidnight...'+lastMidnight)
  //get all users
  User.find().exec(function(err,userdata){
    if(err){
      return handleError(err,res);
    }
    else{
     // console.log('userdata'+JSON.stringify(userdata));
      //iterating users
      for(let i=0;i<userdata.length;i++){
        Bookinfo.find({'user':userdata[i]._id},{}).exec(function(err,bookingdata){
          if(err){
            return handleError(err,res);
          }
          //getting subscription detail of a particular entity
          if(bookingdata.length>0){
            console.log('bookingdata'+JSON.stringify(bookingdata))
          //last subscription
          let recentborrow = bookingdata[bookingdata.length-1];
            if(recentborrow.dueDate>lastMidnight){
              console.log('fine');
              //fulfilling criteria to be Activated
              //do nothing
            }
            else{
              
             userdata[i].latefees = userdata[i].latefees+recentborrow.latefees;
             userdata[i].save(function(err){
              if(err){
                return handleError(err,res);
              }
              else{
                if(i == userdata.length-1){
                  //iterated all users 
                  //now terminate process
                  console.log('terminate process');
                 // process.exit(0);
                }
              }
             })
            }
          }
        })
      }
    }
  })
})
