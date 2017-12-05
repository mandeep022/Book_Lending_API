/**
 * Bookinfo model events
 */

'use strict';

import {EventEmitter} from 'events';
var BookinfoEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
BookinfoEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Bookinfo) {
  for(var e in events) {
    let event = events[e];
    Bookinfo.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    BookinfoEvents.emit(event + ':' + doc._id, doc);
    BookinfoEvents.emit(event, doc);
  };
}

export {registerEvents};
export default BookinfoEvents;
