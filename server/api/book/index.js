'use strict';

var express = require('express');
var controller = require('./book.controller');
import * as auth from '../../auth/auth.service';
var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);
//get recent five books
router.get('/recent', controller.bookdata);
//get books by genre name
router.get('/by/genre/:genrename', controller.bookdatabygenre);
//get books by authorname name
router.get('/by/author/:authorname', controller.bookdatabyAuthor);

//get recent five books
router.get('/title/:titleName', controller.searchByTitle);
module.exports = router;
