import React, { useState } from "react";
import Button from "./Button";
import './style/Timekeeper.css';

class Timekeeper extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            dataByMonth: typeof props.dataByMonth === 'undefined' ? [] : props.dataByMonth,
            timeSum: typeof props.timeSum === 'undefined' ? [] : props.timeSum,
            categories: typeof props.categories === 'undefined' ? [] : props.categories,
            newYear: '2024',
            newMonth: '11',
            newDay: '11'
        };
        this.saveDay = this.saveDay.bind(this);
    }

    componentDidMount() {
        // fetch all data by month
        if (this.state.dataByMonth == null || this.state.dataByMonth.length === 0) {
            fetch("http://localhost:8080/date/" +this.props.userInputYear+ "/" +this.props.userInputMonth+ "/")
                .then(response => response.json())
                .then(data => this.setState({dataByMonth: data}));
        }
        //fetch total amount for each day
        if (this.state.timeSum == null || this.state.timeSum.length === 0) {
            fetch("http://localhost:8080/date/" +this.props.userInputYear+ "/" +this.props.userInputMonth+ "/sum")
                .then(response => response.json())
                .then(data => this.setState({timeSum: data}));
        }
        //fetch all categories for dropdown
        if (this.state.categories == null || this.state.categories.length === 0) {
            fetch("http://localhost:8080/category/all")
                .then(response => response.json())
                .then(data => this.setState({categories: data}));
        }
    }

    //refetch if month changes
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.userInputYear !== prevProps.userInputYear) {
            fetch("http://localhost:8080/date/" +this.props.userInputYear+ "/" +this.props.userInputMonth+ "/")
                .then(response => response.json())
                .then(data => this.setState({dataByMonth: data}));
        }
        if (this.props.userInputYear !== prevProps.userInputYear) {
            fetch("http://localhost:8080/date/" +this.props.userInputYear+ "/" +this.props.userInputMonth+ "/sum")
                .then(response => response.json())
                .then(data => this.setState({timeSum: data}));
        }
    }

    // remove a day
    removeDay(dayId, listIndex){
        fetch("http://localhost:8080/date/delete/" +dayId, { method:"DELETE"})
            .then(() => {
                this.setState(({ dataByMonth }) => {
                    const tempDataByMonth = [...dataByMonth];
                    tempDataByMonth.splice(listIndex,1);
                    return { dataByMonth: tempDataByMonth };
                });
            });
    }

    
    //create a day by today's date and user select
    createDay() {
        const newDay = {
            year: document.getElementById("year").value,
            month: document.getElementById("month").value,
            day: document.getElementById("day").value,
            comment: document.getElementById("comment").value
        };
        fetch("http://localhost:8080/date/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newDay)
        })
            .then(response => response.json())
    }


    //edit a day add amount to category
    saveDay() {
        const saveDay = {
            category: document.getElementById("category").value,
            amount: document.getElementById("amount").value,
            entryDate: 3
        };
        fetch("http://localhost:8080/time/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(saveDay)
        })
            .then(response => response.json())
            .then(data => {
                this.setState(({ dataByMonth }) => {
                    const tempDataByMonth = [...dataByMonth];
                    tempDataByMonth.push(data);
                    return { dataByMonth: tempDataByMonth };
                });
                window.location.reload();
            });
    }


    // this creates the table from fetched data
    render(){
        let timeSum = this.state.timeSum.length === 0 ? [] : this.state.timeSum;
        let tRows = this.state.dataByMonth.map((dataByMonth, listIndex)=>{
            const innerlist = dataByMonth.times.map((byCat, listIndex)=>{
                return(
                    <li key={listIndex} >{byCat.category.category}: {byCat.amount}</li>
                );
            });

            // single row
            return(
                <tr key={dataByMonth.id}>
                    <td>{dataByMonth.date}</td>
                    <td>{timeSum[listIndex]}</td>
                    <td><ul compact>{innerlist}</ul></td>
                    <td>{dataByMonth.comment}</td>
                    <td>
                        <Button 
                            label="Löschen" 
                            key={"delete_"+listIndex} 
                            onClick={() => this.removeDay(dataByMonth.id, listIndex)} />
                            <Button 
                            label="Bearbeiten" 
                            key={"edit_"+listIndex} 
                            onClick={() => this.props.editTime(dataByMonth.id)} />
                    </td>
                </tr>
            );
        });

        // categories list for dropdown
        let categories = this.state.categories.map((category, listIndex)=>{
            return(
                <option key={listIndex} value={category.id}>{category.category}</option>
            );
        });

        //function to toogle and hidde Edit.js
        function ToggleVisibility({ children }) {
              // React state to manage visibility
            const [show, setShow] = useState();

            // function to toggle the boolean value
            function toggleShow() {
                setShow(!show);
            }
            return (
                <div className="component-container">
                {children}
                </div>
            );
        }

        function Edit({saveDay}) {
            return (
              <div className="default-container">
                <form>
                    <h2>Neuer Eintrag</h2>
                    <label>
                    Kategorie:
                    </label>
                    <select id="category">
                        {categories}
                    </select>
                     <input type="text" name="amount" id="amount" defaultValue="00:00:00"/>
                </form>
                <Button label="Speichern" onClick={saveDay} />

              </div>
            );
          }

        //function to set defaultValue of today
        function setToday(){
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0');
            let yyyy = today.getFullYear();
            today = yyyy + '-' + mm + '-' + dd;
            return today;
        }
        //function to set default single day
        function setSingleDay(){
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            today = dd;
            return today;
        }

        // function to toggle all the edit and create new stuff
        var hidden = true;
        function toggle() {
            hidden = !hidden;
            if(hidden){
                document.getElementById("EditHidden").style.visibility = "hidden";
                document.getElementById("EditHidden").style.display = "none";
                document.getElementById("showstuff").style.visibility = "visible";
                document.getElementById("newDay").style.visibility = "visible";
                document.getElementById("newDay").style.display = "block";
            }else{
                document.getElementById("EditHidden").style.visibility = "visible";
                document.getElementById("EditHidden").style.display = "block";
                document.getElementById("showstuff").style.visibility = "hidden";
                document.getElementById("newDay").style.visibility = "hidden";
                document.getElementById("newDay").style.display = "none";
            }
        }
        
        // create table
        return (
            <div className="Timekeeper">
                <div className="EditHidden" id="EditHidden" hidden>
                    <ToggleVisibility>{Edit({saveDay: this.saveDay})}</ToggleVisibility>
                    <Button label="Abbrechen" onClick={() => { toggle(); window.location.reload(); }} />
                </div>
                <div className="showstuff" id="showstuff">
                    <Button label="Neuer Zeiteintrag" onClick={() => toggle()} />
                </div>
                <br/>
                <hr/>
                <br/>
            <div className='newDay' id="newDay">
                <form>
                    <label id='newDate'>
                        Datum:
                        <input type="text" id="year" name="year" defaultValue={this.props.userInputYear}/>
                        <input type="text" id="month" name="month" defaultValue={this.props.userInputMonth}/>
                        <input type="text" id="day" name="day" defaultValue={setSingleDay()}/>
                    </label>
                    <label>
                        Kommentar:
                        <textarea rows="2" cols="67" name="comment" id='comment' />
                    </label>
                    <button type="button" onClick={() => { this.createDay(); toggle(); console.log("test") }}>Neuer Tag</button>
                    <hr/>
                </form>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Datum</th>
                        <th>Total Zeit</th>
                        <th>Bereiche</th>
                        <th>Kommentar</th>
                        <th>Bearbeiten</th>
                    </tr>
                </thead>
                <tbody>
                    { tRows }
                </tbody>
            </table>
        </div>
        );
    }
}

export default Timekeeper;