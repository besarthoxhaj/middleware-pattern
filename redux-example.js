'use strict';

var redux = require('./redux.js');

function middleware (store) {
  return function (dispatch) {
    return function (action) {
      console.log('hello middleware');
      return dispatch(action);
    };
  };
}

var createStoreSubstitute = redux.applyMiddleware(middleware)(redux.createStore);

function reducer (state, action) {
  if (action.type === 'one') return 'one';
  return 'none';
}

function actionCreator () { return { type:'two' }; }

var store = createStoreSubstitute(reducer, 'start');
store.subscribe(function () { console.log('hello listener') });

store.dispatch({type:'one'});
console.log(store.getState());
// 'hello middleware'
// 'hello listener'
// -> 'one'

store.dispatch(actionCreator());
console.log(store.getState());
// 'hello middleware'
// 'hello listener'
// -> 'none'

var dispatchAction = redux.bindActionCreator(actionCreator,store.dispatch);
dispatchAction();
console.log(store.getState());
// 'hello middleware'
// 'hello listener'
// -> 'none'
