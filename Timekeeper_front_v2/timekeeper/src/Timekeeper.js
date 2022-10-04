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
            catID: typeof props.catID === 'undefined' ? [] : props.catID,
            newYear: '2022',
            newMonth: '01',
            newDay: '01',
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

    //refetch if month/year changes
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.userInputYear !== prevProps.userInputYear || this.props.userInputMonth !== prevProps.userInputMonth) {
            fetch("http://localhost:8080/date/" +this.props.userInputYear+ "/" +this.props.userInputMonth+ "/")
                .then(response => response.json())
                .then(data => this.setState({dataByMonth: data}));
        }
        if (this.props.userInputYear !== prevProps.userInputYear || this.props.userInputMonth !== prevProps.userInputMonth) {
            fetch("http://localhost:8080/date/" +this.props.userInputYear+ "/" +this.props.userInputMonth+ "/sum")
                .then(response => response.json())
                .then(data => this.setState({timeSum: data}));
        }
        if (this.state.newDay !== prevState.newDay) {
            fetch("http://localhost:8080/date/" +document.getElementById("year").value+ "/" +document.getElementById("month").value+ "/" +document.getElementById("day").value+ "/id")
                .then(response => response.json())
                .then(data => this.setState({catID: data}))
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

    
    //create a day by user input
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


    //edit a day and add amount to category
    saveDay() {
        const saveDay = {
            category: document.getElementById("category").value,
            amount: document.getElementById("amount").value,
            entryDate: 3
            //TODO this needs to be the id of the day from user input -> find entrydate id by date (listIndex?)
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
                    <td><ul compact="compact">{innerlist}</ul></td>
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
                            <p>cat: </p>
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
        function Edit({saveDay}, {newDay}) {
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
                <button type="button" onClick={() => { console.log({newDay}) }}>Console.log</button>
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
        //function to update state values
        function updateState(){
            this.setState({newDay: document.getElementById("day").value});
            this.setState({newMonth: document.getElementById("month").value});
            this.setState({newYear: document.getElementById("year").value});
        }
        
        // create table
        return (
            <div className="Timekeeper">

                <button type="button" onClick={() => { console.log(this.state.catID.id) }}>Console.log</button>
                <p>cat ID is: {this.state.catID.id}</p>
                <div className="EditHidden" id="EditHidden" hidden>
                    <ToggleVisibility>{Edit({saveDay: this.saveDay}, {newDay: this.state.newDay})}</ToggleVisibility>
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
                    <button type="button" onClick={() => { toggle(); this.setState({newDay: document.getElementById("day").value}); this.createDay();}}>Neuer Tag Erstellen</button>
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