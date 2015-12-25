# middleware-pattern
Example of middleware pattern 

### express
```js
function makeApp () {
  var middlewareStore = [];
  function app () { 
    var index = 0;
    function next (err) {
      var layer = middlewareStore[index++];
      if (layer) {
        return layer(next);  
      }
    }
    next();
  }
  app.add = function (fn) {
    middlewareStore.push(fn);
  }
  return app;
}

var app = makeApp();

app.add(function (next) {
  console.log('One!');
  next();
});

app.add(function (next) {
  console.log('Two!');
  next();
});

app();
// One!
// Two!
```

### redux
```js
function createStore (reducer,initialState) {
  var currentState = initialState;
  function dispatch (action) {
    currentState = reducer(currentState,action);
  }
  function getState () {
    return currentState;
  }
  return {
    dispatch: dispatch,
    getState: getState
  };
}

function middleware (store) {
  return function (dispatch) {
    return function (action) {
      console.log('hello middleware');
      var result = dispatch(action);
      return result;
    };
  };
}

function applyMiddleware (middleware) {
  return function (createStore) {
    return function (reducer, initialState) {
      var store = createStore(reducer, initialState);
      return {
        getState: store.getState,
        dispatch: middleware(store)(store.dispatch)
      };
    };
  };
}

var appCreateStore = applyMiddleware(middleware)(createStore);

function reducer (state, action) {
  if (action.type === 'one') {
    return 'one'
  }
  return 'none';
}

var store = appCreateStore(reducer, 'start');
store.dispatch({type:'one'});
store.getState();
```