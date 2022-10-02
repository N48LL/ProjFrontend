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
            newYear: '2022',
            newMonth: '12',
            newDay: '15',
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

    
    //create a day by today's date and user select
    createDay() {
        const newDay = {
            year: this.state.newYear,
            month: this.state.newMonth,
            day: this.state.newDay,
            comment: document.getElementById("date").value
        };
        fetch("http://localhost:8080/date/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newDay)
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
    //edit a day add amount to category
    saveDay() {
        const saveDay = {
            category: 4,
            amount: "03:30:00",
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
                            onClick={() => this.removeTime(dataByMonth.id, listIndex)} />
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
            var buttonText = show ? "Schliesen" : "Eintrag Erstellen";

            return (
                <div className="component-container">
                {show && children}
                <button onClick={toggleShow}>{buttonText}</button>
                </div>
            );
        }

        function Edit({saveDay}) {
            return (
              <div className="default-container">
                
                <form>
                    <b>Kategorie:</b>
                    <label>
                        Schule:
                    </label>
                     <input type="text" name="Schule" id="1" defaultValue="00:00"/>
                    <label>
                        Zusammenarbeit:
                    </label>
                        <input type="text" name="Zusammenarbeit" id="2" defaultValue="00:00"/>
                    <label>
                    Weiterbildung:
                    </label>
                        <input type="text" name="Weiterbildung" id="3" defaultValue="00:00"/>
                    <label>
                    Flex:
                    </label>
                        <input type="text" name="Flex" id="4" defaultValue="00:00"/>
                    <label>
                    Förderverantwort:
                    </label>
                        <input type="text" name="Förderverantwort" id="5" defaultValue="00:00"/>
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
        // create table
        return (
            <div className="Timekeeper">
                                    
                    <ToggleVisibility>{Edit({saveDay: this.saveDay})}</ToggleVisibility>
                    <br/>
            <div className='new'>
                <form>
                    <label id='newDate'>
                        Datum:
                        <input type="year" id="year" name="year" defaultValue={this.props.userInputYear}/>
                        <input type="month" id="month" name="month" defaultValue={this.props.userInputMonth}/>
                        <input type="day" id="day" name="day" defaultValue={setSingleDay()}/>
                    </label>
                    <label>
                        Kommentar:
                        <textarea rows="2" cols="85" name="comment" id='comment' />
                    </label>
                    <Button label="Eintrag Erstellen" onClick={() => this.createDay()} />
                    <hr/>
                    <label>
                        Datum:
                        <input type="date" name="date" id="date" defaultValue={setToday()}/>
                    </label>
                    <label>
                        Kategorie:
                        <select name="category">
                        <option value="default" hidden="hidden">Wähle eine Kategorie</option>
                        {categories}
                        </select>
                    </label>
                    <label>
                        Zeit:<br/>
                        <input type="time" name="time" step="2" id='time' defaultValue="00:00:00"/>
                    </label>
                    
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