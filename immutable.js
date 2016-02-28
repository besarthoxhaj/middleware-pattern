'use strict';

var redux = require('./redux.js');

function reducer (state, action) {
  if (action.type === 'name') {
    state.name = action.payload;
    return state;
  } else {
    return state;
  };
}

var initalStore = {};

var store = redux.createStore(reducer,initalStore);

store.dispatch({type:'name',payload:'Bes'});
var currentStore = store.getState();


(initalStore === currentStore);
// true, same object

delete initalStore.name;

console.log(initalStore); // {}
console.log(currentStore); // {}
