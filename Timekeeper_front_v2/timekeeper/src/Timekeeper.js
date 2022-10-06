import React, { useState } from "react";
import Button from "./Button";
import './style/Timekeeper.css';

class Timekeeper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataByMonth: typeof props.dataByMonth === 'undefined' ? [] : props.dataByMonth,
            saveDay: typeof props.saveDay === 'undefined' ? [] : props.saveDay,
            timeSum: typeof props.timeSum === 'undefined' ? [] : props.timeSum,
            categories: typeof props.categories === 'undefined' ? [] : props.categories,
            catID: typeof props.catID === 'undefined' ? [] : props.catID,
            saveDayonEdit: typeof props.saveDayonEdit === 'undefined' ? [] : props.saveDayonEdit,
            editTime: typeof props.editTime === 'undefined' ? [] : props.editTime,
            fields: { year: '', month: '', day: '' },
            errors: { year: '', month: '', day: '' },
            id: "1",

        };
        this.saveDay = this.saveDay.bind(this);
        this.saveDayonEdit = this.saveDayonEdit.bind(this);
        this.updateId = this.updateId.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.submituserCreateNewForm = this.submituserCreateNewForm.bind(this);

    }

    //////////////////Validation ///////////////////
    // TODO: Fetching verlinken @alert

    handleChange(e) {
        let fields = this.state.fields;
        fields[e.target.name] = e.target.value;
        this.setState({
          fields
        });
  
      }
  

      submituserCreateNewForm(e) {
        e.preventDefault();
        if (this.validateForm()) {
            let fields = {};
            fields["year"] = "";
            fields["month"] = "";
            fields["day"] = "";
            this.setState({fields:fields});
            alert("Alle Eingaben sind korrekt!");
        }
      }



      validateForm() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        if (!fields["year"]) {
            formIsValid = false;
            errors["year"] = "*Bitte geben Sie ein Jahr ein.";
        }

        if (typeof fields["year"] !== "undefined") {
            if (!fields["year"].match(/^[0-9]{4}$/)) {
                formIsValid = false;
                errors["year"] = "*Bitte geben Sie ein gültiges Jahr ein.";
            }
        }

        if (!fields["month"]) {
            formIsValid = false;
            errors["month"] = "*Bitte geben Sie einen Monat ein.";
        }

        if (typeof fields["month"] !== "undefined") {
            if (!fields["month"].match(/^[0-9]{2}$/)) {
                formIsValid = false;
                errors["month"] = "*Bitte geben Sie einen gültigen Monat ein.";
            }
        }

        if (!fields["day"]) {
            formIsValid = false;
            errors["day"] = "*Bitte geben Sie einen Tag ein.";
        }

        if (typeof fields["day"] !== "undefined") {
            if (!fields["day"].match(/^[0-9]{2}$/)) {
                formIsValid = false;
                errors["day"] = "*Bitte geben Sie einen gültigen Tag ein.";
            }
        }

        // comment validation of 512 @ inline texarea maxLength={512}


        this.setState({
            errors: errors
        });
        return formIsValid;
    }

        /////////////////Ende Validation/////////////////

    updateId = (p) => {
        this.setState({ id: p });
        this.setState({ isHidden: true });
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

    // fetch id by date
    fetchID(year, month, day) {
        fetch("http://localhost:8080/date/" +year+ "/" +month+ "/" +day+ "/id")
            .then(response => response.json())
            .then(data => this.setState({catID: data}))
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

    
    // create a day by user input
    // validate if day already exists
    createDay() {
        const newDay = {
            year: document.getElementById("year").value,
            month: document.getElementById("month").value,
            day: document.getElementById("day").value,
            comment: document.getElementById("comment").value
        };
        let checkifExists = document.getElementById("year").value + "-" + document.getElementById("month").value + "-" + document.getElementById("day").value;
        let tRows = this.state.dataByMonth.map((dataByMonth, listIndex)=>{
            if (dataByMonth.date === checkifExists) {
                alert("Dieser Tag existiert bereits!");
            } else if (listIndex === this.state.dataByMonth.length - 1) {
        fetch("http://localhost:8080/date/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newDay)
        })
            .then(response => response.json())
    }
        });
    }



    // edit a day and add amount to category
    saveDay() {
        const saveDay = {
            category: document.getElementById("category").value,
            amount: document.getElementById("amount").value,
            entryDate: this.state.catID.id
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
                this.setState(({ saveDay }) => {
                    const tempsaveDay = [...saveDay];
                    tempsaveDay.push(data);
                    return { saveDay: tempsaveDay };
                });
                window.location.reload();
            });
    }

    saveDayonEdit() {
        const saveDayonEdit = {
            category: document.getElementById("category").value,
            amount: document.getElementById("amount").value,
            entryDate: this.state.id
        };
        fetch("http://localhost:8080/time/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(saveDayonEdit)
        })
            .then(response => response.json())
            .then(data => {
                this.setState(({ saveDayonEdit }) => {
                    const tempsaveDay = [...saveDayonEdit];
                    tempsaveDay.push(data);
                    return { saveDayonEdit: tempsaveDay };
                });
                window.location.reload();
            });
    }


    // this creates the table from fetched data
    render(){
        const id = this.state.id;
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
                            label="Hinzufügen" 
                            key={"add_"+listIndex} 
                            onClick={() => {toggle(); this.updateId(dataByMonth.id)}} />
                    <Button 
                            label="Bearbeiten" 
                            key={"edit_"+listIndex} 
                            onClick={() => this.props.editTime(dataByMonth.id)} />
                        <hr></hr>
                        <Button 
                            label="Löschen" 
                            key={"delete_"+listIndex} 
                            onClick={() => this.removeDay(dataByMonth.id, listIndex)} />
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
            function scrollTop() {
                window.scrollTo(0, 0);
            }
            return (
                <div className="component-container">
                {children} {scrollTop()}
                </div>
            );
        }
        //TODO: switch um die Speicehrbuttons indivieduell zu machen
        function Edit({saveDay}, {saveDayonEdit}) {
            return (
              <div className="default-container">
                <form>
                    <h1>Neuer Eintrag</h1>
                    <div className="dates">
                        <label>Kategorie</label>
                        <select id="category">{categories}</select>
                    </div>
                    <div className="dates">
                        <label>Zeit</label>
                        <input type="text" name="amount" id="amount" defaultValue="00:00:00"/>
                    </div>
                     
                </form>
                <Button label="Speichern für neuer Tag" onClick={saveDay} />
                <Button label="Speichern für Hinzufügen" onClick={saveDayonEdit} />
              </div>
            );
          }

        //function to set defaultValue of today
       /* function setToday(){
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0');
            let yyyy = today.getFullYear();
            today = yyyy + '-' + mm + '-' + dd;
            return today;
        } */
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
                document.getElementById("hide").style.visibility = "visible";
                document.getElementById("hide").style.display = "block";
            }else{
                document.getElementById("EditHidden").style.visibility = "visible";
                document.getElementById("EditHidden").style.display = "block";
                document.getElementById("hide").style.visibility = "hidden";
                document.getElementById("hide").style.display = "none";
            }
        }
        //function to update state values
        //function updateState(){
          //  this.setState({newDay: document.getElementById("day").value});
            //this.setState({newMonth: document.getElementById("month").value});
            //this.setState({newYear: document.getElementById("year").value});
        //}

        // create table
        return (
            <div className="Timekeeper">
                <div className="EditHidden" id="EditHidden" hidden>
                    <ToggleVisibility>{Edit({saveDay: this.saveDay}, {saveDayonEdit: this.saveDayonEdit})}</ToggleVisibility>
                    <Button label="Abbrechen" onClick={() => { toggle(); window.location.reload(); }} />
                </div>
            <div className='CreateDay'>
                <br/>
                <form method="post"  name="userRegistrationForm"  onSubmit= {this.submituserCreateNewForm}>
                    <div className="dates">
                        <label>Jahr</label>
                        <input type="text" id="year" name="year" list="todayYear" autoComplete="off" value={this.state.fields.year} onChange={this.handleChange}/>
                            <datalist id="todayYear">
                                <option value={this.props.userInputYear}>Heute: {setSingleDay()}.{this.props.userInputMonth}{this.props.userInputYear}</option>
                            </datalist>
                        <div className="errorMsg">{this.state.errors.year}</div>
                    </div>
                    <div className="dates">
                    <label>Monat</label>
                        <input type="text" id="month" name="month" list="todayMonth" autoComplete="off" value={this.state.fields.month} onChange={this.handleChange}/>
                        <datalist id="todayMonth">
                                <option value={this.props.userInputMonth}>Heute: {setSingleDay()}.{this.props.userInputMonth}{this.props.userInputYear}</option>
                            </datalist>
                        <div className="errorMsg">{this.state.errors.month}</div>
                    </div>
                    <div className="dates">
                        <label>Tag</label>
                        <input type="text" id="day" name="day" list="todayDay" autoComplete="off" value={this.state.fields.day} onChange={this.handleChange}/>
                        <datalist id="todayDay">
                                <option value={setSingleDay()}>Heute: {setSingleDay()}.{this.props.userInputMonth}{this.props.userInputYear}</option>
                            </datalist>
                        <div className="errorMsg">{this.state.errors.day}</div>
                    </div>
                    <div className="btn_dates" id='hide'>
                    <button className='btn_create' type="button" onClick={() => { this.fetchID(document.getElementById("year").value, document.getElementById("month").value, document.getElementById("day").value); toggle(); this.setState({newDay: document.getElementById("day").value}); this.createDay(); }}>Neuer Tages Eintrag</button>
                    </div>
                    <br/>
                    <div className="field_dates" id="hidden">
                       <label>Kommentar: </label>
                        <textarea rows="2" cols="67" maxLength={512} value={this.state.fields.comment} name="comment" id='comment' autoComplete="off" onChange={this.handleChange} /> 
                        <div className="errorMsg">{this.state.errors.comment}</div>
                    </div>
                    <br/>
                    <input type="submit" value="Eingaben Prüfen" className="button" /> 
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
// sorry for spagetthi code... xD
export default Timekeeper;