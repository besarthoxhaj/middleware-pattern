'use strict';

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

function middleware (store) {
  return function (dispatch) {
    return function (action) {
      console.log('hello middleware');
      return dispatch(action);
    };
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

function bindActionCreators (actionCreators, dispatch) {
  return function () { dispatch(actionCreators()); };
}

var createStoreSubstitute = applyMiddleware(middleware)(createStore);

function reducer (state, action) {
  if (action.type === 'one') return 'one';
  return 'none';
}

function actionCreator () { return { type:'two' }; }

var store = createStoreSubstitute(reducer, 'start');
store.subscribe(function () { console.log('hello listener') })

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

var dispatchAction = bindActionCreators(actionCreator,store.dispatch);
dispatchAction();
console.log(store.getState());
// 'hello middleware'
// 'hello listener'
// -> 'none'
