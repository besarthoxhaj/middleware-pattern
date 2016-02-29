'use strict';

module.exports = {
  createStore: createStore,
  applyMiddleware: applyMiddleware,
  bindActionCreator: bindActionCreator,
  compose: compose
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

/**
 *  Compose function
 *

  function add_one (n) {
    const total = n + 1;
    return total;
  }

  function less_one (n) {
    const total = n - 1;
    return total;
  }

  function multiply_two (n) {
    const total = n * 2;
    return total;
  }

  function start (n) {
    return parseInt(n);
  }

  const parseAddMultiplyLess = compose(
    less_one,
    multiply_two,
    add_one,
    start
  );

  parseAddMultiplyLess('1'); // 3
 *
 */
function compose () {
  const outer = ([]).slice.call(arguments,0);
  return function () {
    const inner = ([]).slice.call(arguments,0);
    const last_func = outer[outer.length - 1];
    const rest_func = outer.slice(0, -1);
    return rest_func.reduceRight((composed, f) => {
      return f(composed);
    }, last_func.apply(undefined,inner));
  };
}
