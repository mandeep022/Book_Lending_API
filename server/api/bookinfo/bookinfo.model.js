'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './bookinfo.events';
import {Schema} from 'mongoose';;
var BookinfoSchema = new mongoose.Schema({
  bookid:{
  	type:Schema.ObjectId,
  	ref:'Book'
  },
  //who borrows or reserves book
   user:{
  	type:Schema.ObjectId,
  	ref:'User'
  },
  //it would be updated manually
  latefees:{
  	type:Number,
  	default:0
  },
  ///borrows or reserves
  status:{
  	type:String
  },
  //if borrowed
  dueDate:{
  	type:Date
  },

  createdAt:{
  	type:Date,
  	default:Date.now
  }
});

registerEvents(BookinfoSchema);
export default mongoose.model('Bookinfo', BookinfoSchema);
