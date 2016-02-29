'use strict';


const redux = require('./redux.js');

const catchError = store => dispatch => action => {
  try {
    return dispatch(action);
  } catch (e) {
    console.log(e);
  }
}

const sub_store = redux.applyMiddleware(catchError)(redux.createStore);

function reducer (state, action) {
  var thisIsNotDefined;
  if (thisIsNotDefined.type === 'one') return 'one';
  return 'none';
}

function actionCreator () { return { type:'two' }; }

let store = sub_store(reducer,'start');

store.dispatch({type:'one'});
console.log(store.getState());

// [TypeError: Cannot read property 'type' of undefined]
// start