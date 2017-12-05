/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/books              ->  index
 * POST    /api/books              ->  create
 * GET     /api/books/:id          ->  show
 * PUT     /api/books/:id          ->  upsert
 * PATCH   /api/books/:id          ->  patch
 * DELETE  /api/books/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Book from './book.model';

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

// Gets a list of Books
export function index(req, res) {
  return Book.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Book from the DB
export function show(req, res) {
  return Book.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Book in the DB
export function create(req, res) {
  return Book.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Book in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Book.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Book in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Book.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Book from the DB
export function destroy(req, res) {
  return Book.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}


// export function searchByTitle(req, res) {
//   var searchKey = req.params.searchKey;
//   Product.paginate({'title':{'$regex': searchKey ,"$options": "i"}},{},function(err,result){
//     if(err){
//       return handleError(res);
//     }
//     else{
//       //return callback as response
//       res.json(result);
//     }
//   });

// }

//get recent five books
export function bookdata(req,res){
  Book.find().sort('-createdAt').limit(5).exec(function(bookdatas){
    if(err){
      return handleError(res);
    }
    else{
      res.json(bookdatas);
    }
  })
}

//get all books by genre
export function bookdatabygenre(req,res){
  Book.find({genre:req.params.genrename},{}).sort('-createdAt').exec(function(bookbygenre){
    if(err){
      return handleError(res);
    }
    else{
      res.json(bookbygenre);
    }
  })
}


//get all books by genre
export function bookdatabyAuthor(req,res){
  Book.find({authorName:req.params.authorname},{}).sort('-createdAt').exec(function(bookbyauthor){
    if(err){
      return handleError(res);
    }
    else{
      res.json(bookbyauthor);
    }
  })
}

//Custom search by title
export function searchByTitle(req,res){
  Book.find({ title: { $regex:req.body.titleName,$options: 'i' } } ).exec(function(err,data){
    if(err){
      return handleError(res);
    }
    else{
      res.json(data);
    }
  })
}
