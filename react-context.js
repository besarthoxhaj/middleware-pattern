'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const jsdom = require('jsdom');

class Child extends React.Component {

  constructor (props, context) {
    super(props, context);
    console.log('Child',context);
  }

  render () {
    return (null);
  }
}

Child.contextTypes = {
  color: React.PropTypes.string
};

class Parent extends React.Component {

  constructor (props, context) {
    super(props, context);
    console.log('Parent',context);
  }

  getChildContext () {
    return {color: 'purple'};
  }

  render () {
    return (
      React.createElement(Child,null)
    );
  }
}

Parent.childContextTypes = {
  color: React.PropTypes.string
};


jsdom.env('', {
  virtualConsole: jsdom.createVirtualConsole().sendTo(console),
  scripts: ['http://code.jquery.com/jquery-2.1.1.js'],
  done: function (err, window) {

    global.window = window;

    ReactDOM.render(React.createElement(Parent, null), window.document.body);
    // [print in console]
    // Parent {}
    // Child { color: 'purple' }
  }
});
