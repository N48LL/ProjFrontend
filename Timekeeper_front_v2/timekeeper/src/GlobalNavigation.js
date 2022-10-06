import React from 'react';
import Button from './Button';

class GlobalNavigation extends React.Component{sendData = () => {
    }
    constructor(props){
        super(props);
        this.state = {
          years: typeof props.time === 'undefined' ? [] : props.years,
          months: typeof props.time === 'undefined' ? [] : props.months,
          userSelectYear: new Date().getFullYear(),
          userSelectMonth: new Date().getMonth() + 1,
      };
      this.updateInput = this.updateInput.bind(this);
      this.changeuserInputYear = this.props.changeuserInputYear.bind(this);
      this.updateInputMonth = this.updateInputMonth.bind(this);
      this.changeuserInputMonth = this.props.changeuserInputMonth.bind(this);
    }

    //fetch data for years, months from API
    componentDidMount() {
      if (this.state.years == null || this.state.years.length === 0) {
          fetch("http://localhost:8080/date/years")
              .then(response => response.json())
              .then(data => this.setState({years: data}));
      }
      if (this.state.months == null || this.state.months.length === 0) {
          fetch("http://localhost:8080/date/" +this.state.userSelectYear+ "/months")
              .then(response => response.json())
              .then(data => this.setState({months: data}));
      }
      if (this.state.userSelectYear == null || this.state.userSelectYear.length === 0) {
        this.setState({userSelectYear: this.props.userselectedYear});
      }
      if (this.state.userSelectMonth == null || this.state.userSelectMonth.length === 0) {
        this.setState({userSelectMonth: this.props.userselectedMonth});
      }
    }

    //update fetch data for month from API
    componentDidUpdate(prevProps, prevState) {
      if (this.state.userSelectYear !== prevState.userSelectYear) {
          fetch("http://localhost:8080/date/"+this.state.userSelectYear+"/months")
              .then(response => response.json())
              .then(data => this.setState({months: data}));
      }
      if (this.state.userSelectMonth !== prevState.userSelectMonth) {
        this.changeuserInputYear(this.state.userSelectYear, this.state.userSelectMonth);
      }
    }

    //pass data to parent
    updateInput(e){
      this.setState({userSelectYear: e.target.value});
      this.props.changeuserInputYear(e.target.value);
    }
    updateInputMonth(e){
      this.setState({userSelectMonth: e.target.value});
      this.props.changeuserInputMonth(e.target.value);
    }

    //render dropdown select for years and months
    render(){
    let YearsSelectItems = this.state.years.map((years, listIndex)=>{
      return(
        <option key={listIndex} value={years}>{years}</option>
      );
    });
    let MonthsSelectItems = this.state.months.map((months, listIndex)=>{
      return(
        <option key={listIndex} value={months}>{months}</option>
      );
    });
        return(
          <nav>
            <div className="dates_top">
            <label>Jahr</label>
              <select onChangeCapture={this.updateInput} >
                <option value={this.state.userSelectYear} hidden="hidden">{this.state.userSelectYear}</option>
                {YearsSelectItems}
              </select>
              </div>
              <div className="dates_top">
              <label>Monat</label>
              <select onChangeCapture={this.updateInputMonth}>
                <option value={this.state.userSelectMonth} hidden="hidden">{this.state.userSelectMonth}</option>
                {MonthsSelectItems}
              </select>
              </div>
          </nav>
        )
    }
}

export default GlobalNavigation;