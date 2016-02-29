'use strict';

module.exports = {
  createProvider: createProvider,
  createConnect: createConnect
};

function createProvider (React) {

  const Component = React.Component;

  class Provider extends Component {

    constructor (props, context) {
      super(props, context);
      this.store = props.store;
    }

    componentWillReceiveProps (nextProps) {

      const store = this.store;
      const nextStore = nextProps.store;
    }

    render () {

      console.log('Provider', this.props);

      let children = this.props.children;

      if (typeof children === 'function') {
        // console.log('warnAboutFunctionChild()');
        children = children();
      } else {
        // console.log('warnAboutElementChild();');
      }

      return children;
    }
  }
  
  return Provider; 
}

function createConnect (React) {

  const Component = React.Component;

  return function connect (mapStateToProps) {

    return function wrapWithConnect (WrappedComponent) {

      class Connect extends Component {

        constructor (props, context) {
          super(props, context);
          this.state = { storeState: null };
        }

        componentWillUpdate () {
          this.trySubscribe();
        }

        trySubscribe () {
          this.store.subscribe(this.handleChange);
          this.handleChange();
        }

        handleChange () {
          this.setState({storeState: this.store.getState()});
        }

        render () {
          console.log('Connect', this.props);
          return (
            React.createElement(WrappedComponent, {
              store: this.props
            })
          );
        }
      }

      return Connect;
    }
  }
}
