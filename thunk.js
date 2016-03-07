'use strict';

var redux = require('./redux.js');

function thunk (store) {
  return function (dispatch) {
    return function (action) {
      if (typeof action === 'function') {
        return action(store.dispatch, store.getState);
      }
      return dispatch(action);
    }
  }
}

var createStoreSubstitute = redux.applyMiddleware(
  thunk
)(redux.createStore);

function reducer (state, action) {
  if (action.type === 'one') return 'one';
  return 'none';
}

function actionCreator () { return { type:'two' }; }

var store = createStoreSubstitute(reducer, 'start');

function asyncStuff (item) {
  return function (dispatch,getState) {
    process.nextTick(function () {
      dispatch(actionCreator);
    });
  };
}

store.dispatch(asyncStuff());

console.log(store.getState());
// -> 'start'

process.nextTick(() => {
  console.log(store.getState());
  // -> 'none'
});
