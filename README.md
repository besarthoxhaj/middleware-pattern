# middleware-pattern
Example of middleware pattern 

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
