'use strict';

var redux = require('./redux.js');
var events = require('events');
var notification = new events.EventEmitter();

function createService (store, services) {

  services.forEach(function (service) { 
    service.initialize(store.getState(),store.dispatch);
  });

  store.subscribe(function () {
    services.forEach(function (service) {
      service.update(store.getState(),store.dispatch);
    });
  });
}

function actionCreator (text) {
  return {type:'message', text: text};
}

function reducer (state, action) {
  if (action.type === 'message') {
    var cloneState = state.slice();
    cloneState.push(action.text);
    return cloneState;
  }
  return state;
}

var store = redux.createStore(reducer,[]);

var simpleService = {
  initialize: function (state,dispatch) {
    console.log('service:initialize');
    notification.on('message', this.onMessage.bind(null,state,dispatch));
  },
  update: function () {
    console.log('service:update');
  },
  onMessage: function (state,dispatch,text) {
    dispatch(actionCreator(text));
  }
};

createService(store,[simpleService]);
// service:initialize

store.dispatch(actionCreator('start!'));
// service:update

notification.emit('message', 'hello!');

console.log(store.getState())
