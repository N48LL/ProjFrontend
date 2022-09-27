import React from 'react';


class GlobalNavigation extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          years: typeof props.time === 'undefined' ? [] : props.years,
          userInput: '2022'
      };
      this.updateInput = this.updateInput.bind(this);
    }

    componentDidMount() {
      if (this.state.years == null || this.state.years.length === 0) {
          fetch("http://localhost:8080/date/years")
              .then(response => response.json())
              .then(data => this.setState({years: data}));
      }
  }

  updateInput(e){
    this.setState({userInput: e.target.value});
  }

  render(){
  let selectedYear = this.state.selectedYear;
  let YearsSelectItems = this.state.years.map((years, listIndex)=>{
    return(
      <option key={years} value={years}>{years}</option>
    );
  });

        return(
          <nav>
              <select onChangeCapture={this.updateInput}>
                {YearsSelectItems}
                onChange={this.updateInput}
              </select>
              <p>Year: {this.state.userInput}</p>
          </nav>
        )
    }
}

export default GlobalNavigation;