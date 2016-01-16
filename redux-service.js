'use strict';

var redux = require('./redux.js');

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

function actionCreator () {
  return {type:'hello'};
}

function reducer (state, action) {
  if (action.type === 'hello') return 'one';
  return 'bye';
}

var store = redux.createStore(reducer,{});

var simpleService = {
  initialize: function (state,dispatch) {
    console.log('service:initialize');
  },
  update: function (state,dispatch) {
    console.log('service:update',state);
    if (state === 'one') {
      dispatch({type:'bye'});
    }
  }
};

createService(store,[simpleService]);
// service:initialize

store.dispatch(actionCreator());
// service:update
