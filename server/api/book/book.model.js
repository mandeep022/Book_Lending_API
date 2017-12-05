'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './book.events';
import {Schema} from 'mongoose';
var BookSchema = new mongoose.Schema({
  title:{
  	type:String
  },
  genre:{
  	type:String
  },
  author:{
  	type:Schema.ObjectId,
  	ref:'User'
  },
  authorName:{
  	type:String
  },
//book out/reserved/available
  availablity:{
  	type:String
  },
  //will store all publication infos
  //like edition and all
  publicatonInfo:{},
  createdAt:{
  	type:Date,
    default:Date.now
  }
  
});

registerEvents(BookSchema);
export default mongoose.model('Book', BookSchema);
