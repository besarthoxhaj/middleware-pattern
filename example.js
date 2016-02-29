'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const jsdom = require('jsdom');
const Provider = require('./redux-react.js').createProvider(React);
const Connect = require('./redux-react.js').createConnect(React);
const redux = require('./redux.js');

const reducer = (state, action) => {
  console.log('redux');
  if (action.type === 'one') return 'one';
  return 'none';
};

const store = redux.createStore(reducer,'start');

const HelloWorld = React.createClass({
  displayName: 'HelloWorld',
  render: function () {
    console.log('HelloWorldComponent',this.props);
    return (
      React.createElement('div',null)
    );
  }
});

const HelloWorldContainer = React.createClass({
  displayName: 'HelloWorldContainer',
  render: function () {
    console.log('HelloWorldContainer',this.props);
    return (
      React.createElement(HelloWorld,null)
    );
  }
});

const mapStateToProps = state => {
  return Object.keys(state).reduce((acc,elm) => {
    acc[elm] = state[elm];
    return acc;
  },{});
};

const HelloWorldReduxContainer = Connect(mapStateToProps)(HelloWorldContainer);

const App = React.createClass({
  displayName: 'App',
  render: function () {
    console.log('App');
    return (
      React.createElement(Provider, {
        store: store
      }, function () {
        return React.createElement(HelloWorldReduxContainer, null);
      })
    );
  }
});

jsdom.env('', {
  virtualConsole: jsdom.createVirtualConsole().sendTo(console),
  scripts: ['http://code.jquery.com/jquery-2.1.1.js'],
  done: function (err, window) {

    global.window = window;

    ReactDOM.render(React.createElement(App, null), window.document.body);

    process.nextTick(function () {

      console.log('next');
      store.dispatch({type:'one'});

      process.nextTick(function () {

        console.log('final');
      });
    })
  }
});
