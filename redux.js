'use strict';

module.exports = {
  createStore: createStore,
  applyMiddleware: applyMiddleware,
  bindActionCreator: bindActionCreator,
};

function createStore (reducer,initialState) {
  var currentState = initialState;
  var listeners = [];
  function dispatch (action) {
    currentState = reducer(currentState,action);
    listeners.slice().forEach(l => l());
  }
  function getState () {
    return currentState;
  }
  function subscribe (listener) {
    listeners.push(listener);
  }
  return {
    dispatch: dispatch,
    getState: getState,
    subscribe: subscribe
  };
}

function applyMiddleware (middleware) {
  return function (createStore) {
    return function createStoreSubstitute (reducer, initialState) {
      var store = createStore(reducer, initialState);
      return {
        getState: store.getState,
        dispatch: middleware(store)(store.dispatch),
        subscribe: store.subscribe,
      };
    };
  };
}

function bindActionCreator (actionCreators, dispatch) {
  return function () { dispatch(actionCreators()); };
}
