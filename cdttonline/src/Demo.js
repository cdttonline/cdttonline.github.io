import React from "react";


var Demo = React.createClass({

    getInitialState: function() {
      return {showExternalHTML: false};
    },
    
    render: function() {
      return (
        <div>
          <button onClick={this.toggleExternalHTML}>Toggle Html</button>
          {this.state.showExternalHTML ? <div>
            <div dangerouslySetInnerHTML={this.createMarkup()} ></div>
          </div> : null}
        </div>
      );
    },
    
    toggleExternalHTML: function() {
      this.setState({showExternalHTML: !this.state.showExternalHTML});
    },
    
    createMarkup: function() { 
      return {__html: '<div class="ext">Hello!</div>'};
    }
  
  });
  
  ReactDOM.render(
    <Demo />,
    document.getElementById('container')
  );