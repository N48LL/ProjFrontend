import React from 'react';

class GlobalNavigation extends React.Component{sendData = () => {
        this.props.parentCallback("test");
    }
    constructor(props){
        super(props);
        this.state = {
          years: typeof props.time === 'undefined' ? [] : props.years,
          userInput: '2022',
      };
      this.updateInput = this.updateInput.bind(this);
      this.changeuserInput = this.props.changeuserInput.bind(this);
    }

    componentDidMount() {
      if (this.state.years == null || this.state.years.length === 0) {
          fetch("http://localhost:8080/date/years")
              .then(response => response.json())
              .then(data => this.setState({years: data}));
      }
      if (this.state.userInput == null || this.state.userInput.length === 0) {
        this.setState({userInput: this.props.selectedYear});
      }
    }
  
    updateInput(e){
      this.setState({userInput: e.target.value});
      this.props.changeuserInput(e.target.value);
    }

    render(){
    let YearsSelectItems = this.state.years.map((years, listIndex)=>{
      return(
        <option key={listIndex} value={years}>{years}</option>
      );
    });
        return(
          <nav>
              <select onChangeCapture={this.updateInput} >
                {YearsSelectItems}
              </select>
              <p>Year: {this.state.userInput}</p>
          </nav>
        )
    }
}

export default GlobalNavigation;