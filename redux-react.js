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

    getChildContext () {
      return { store: this.store };
    }

    componentWillReceiveProps (nextProps) {

      const store = this.store;
      const nextStore = nextProps.store;
    }

    render () {

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
  
  Provider.childContextTypes = {
    store: React.PropTypes.object
  };

  return Provider; 
}

function createConnect (React) {

  const Component = React.Component;

  return function connect (mapStateToProps) {

    return function wrapWithConnect (WrappedComponent) {

      class Connect extends Component {

        constructor (props, context) {
          super(props, context);

          this.handleChange = this.handleChange.bind(this);
          this.trySubscribe = this.trySubscribe.bind(this);

          this.state = { storeState: null };
          this.store = context.store;
        }

        componentDidMount () {
          this.trySubscribe();
        }

        trySubscribe () {
          this.store.subscribe(this.handleChange);
          this.handleChange();
        }

        handleChange () {
          this.setState({
            storeState: this.store.getState()
          });
        }

        render () {
          console.log('Render Connect with store:', this.storeState);
          return (
            React.createElement(WrappedComponent, {
              store: this.storeState
            })
          );
        }
      }

      Connect.contextTypes = {
        store: React.PropTypes.object
      };

      return Connect;
    }
  }
}
