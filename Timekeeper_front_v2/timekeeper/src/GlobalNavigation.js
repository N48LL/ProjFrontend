import React from 'react';

class GlobalNavigation extends React.Component{sendData = () => {
        this.props.parentCallback("test");
    }
    constructor(props){
        super(props);
        this.state = {
          years: typeof props.time === 'undefined' ? [] : props.years,
          userSelectYear: '2022',
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
      if (this.state.userSelectYear == null || this.state.userSelectYear.length === 0) {
        this.setState({userSelectYear: this.props.selectedYear});
      }
    }
  
    updateInput(e){
      this.setState({userSelectYear: e.target.value});
      this.props.changeuserInput(e.target.value);
    }

    render(){
    let YearsSelectItems = this.state.years.map((years, listIndex)=>{
      return(
        <option key={listIndex} value={years}>{years}</option>
      );
    });
    let MonthsSelectItems = this.state.years.map((years, listIndex)=>{
      return(
        <option key={listIndex} value={years}>{years}</option>
      );
    });
        return(
          <nav>
              <select onChangeCapture={this.updateInput} >
                {YearsSelectItems}
              </select>
              <select>
                {MonthsSelectItems}
              </select>
              <p>Year: {this.state.userSelectYear}</p>
              <p>Month: {this.state.userInput}</p>
          </nav>
        )
    }
}

export default GlobalNavigation;