import React from "react";
import Button from "./Button";
import './style/Timekeeper.css';
import EditDate from "./EditDate";

class Timekeeper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataByMonth: typeof props.dataByMonth === 'undefined' ? [] : props.dataByMonth,
            timeSum: typeof props.timeSum === 'undefined' ? [] : props.timeSum,
            categories: typeof props.categories === 'undefined' ? [] : props.categories,
            catID: typeof props.catID === 'undefined' ? [] : props.catID,
            saveDayonEdit: typeof props.saveDayonEdit === 'undefined' ? [] : props.saveDayonEdit,
            editTime: typeof props.editTime === 'undefined' ? [] : props.editTime,
            fields: { year: '', month: '', day: ''},
            errors: { year: '', month: '', day: '' },
        };
        this.saveDayonEdit = this.saveDayonEdit.bind(this);
        this.updateId = this.updateId.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.submituserCreateNewForm = this.submituserCreateNewForm.bind(this);
    }

/**
 * 
 * Validation
 * 
 */
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
            this.fetchID(
                document.getElementById("year").value,
                document.getElementById("month").value,
                document.getElementById("day").value);
            this.setState({newDay: document.getElementById("day").value});
            this.createDay();
            window.location.reload();
        }
      }

      validateForm() {
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        if (!fields["year"]) {
            formIsValid = false;
            errors["year"] = "Bitte geben Sie ein Jahr ein.";
        }

        if (typeof fields["year"] !== "undefined") {
            if (!fields["year"].match(/^[0-9]{4}$/)) {
                formIsValid = false;
                errors["year"] = "Bitte geben Sie ein g??ltiges Jahr ein.";
            }
        }

        if (!fields["month"]) {
            formIsValid = false;
            errors["month"] = "*Bitte geben Sie einen Monat ein.";
        }

        if (typeof fields["month"] !== "undefined") {
            if (!fields["month"].match(/^[0-9]{2}$/)) {
                formIsValid = false;
                errors["month"] = "*Bitte geben Sie einen g??ltigen Monat ein.";
            }
        }

        if (!fields["day"]) {
            formIsValid = false;
            errors["day"] = "*Bitte geben Sie einen Tag ein.";
        }

        if (typeof fields["day"] !== "undefined") {
            if (!fields["day"].match(/^[0-9]{2}$/)) {
                formIsValid = false;
                errors["day"] = "*Bitte geben Sie einen g??ltigen Tag ein.";
            }
        }

        // comment validation of max 512 Chars  -> @ inline texarea maxLength={512}
        // if day already exists validation -> @ createDay()


    this.setState({
        errors: errors
    });
        return formIsValid;
    }

/**
 * 
 * Fetch from API
 * 
 */

    updateId = (p) => {
        this.setState({ id: p });
        this.setState({ isHidden: true });
    }

    setEditId = (p) => { 
        this.setState({ EditId: p });
    }

    setEditComment = (p) => {
        this.setState({ EditComment: p });
    }

    componentDidMount() {
        // fetch all data by month
        if (this.state.dataByMonth == null || this.state.dataByMonth.length === 0) {
            fetch("http://localhost:8080/date/" +this.props.userInputYear+ "/" +this.props.userInputMonth+ "/")
                .then(response => response.json())
                .then(data => this.setState({dataByMonth: data}));
        }
        //fetch total amount for each day

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
    // remove all time entries of a day
    removeAllTimeByDayId(dayId){
        try {
            fetch("http://localhost:8080/time/delete/" +dayId, { method:"DELETE"})
                this.setState(({ dataByMonth }) => {
                    const tempDataByMonth = [...dataByMonth];
                    return { dataByMonth: tempDataByMonth };
                }
            );
        }
        catch (e) {
            console.log(e);
        }
    }
    
    // create a day by user input
    // validate if day already exists
    createDay() {
        const newDay = {
            year: document.getElementById("year").value,
            month: document.getElementById("month").value,
            day: document.getElementById("day").value,
            comment: document.getElementById("comment_newDate").value
        };
                //if listindex of dataByMonth is empty create first day of month
                if (this.state.dataByMonth.length === 0) {
                    this.createDayIfEmpty();
                } else {
        let checkifExists = document.getElementById("year").value + "-" + document.getElementById("month").value + "-" + document.getElementById("day").value;
        this.state.dataByMonth.map((dataByMonth, listIndex)=>{
            if (dataByMonth.date === checkifExists){
                alert("Dieser Tag existiert bereits!");
            } else {
        fetch("http://localhost:8080/date/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newDay)
        })
            .then(response => response.json())
            .then(data => this.setState({newDay: data}))
    }
        return newDay;
        });}
    }

    // create first day if month empty
    createDayIfEmpty() {
        const newDay = {
            year: document.getElementById("year").value,
            month: document.getElementById("month").value,
            day: "01",
            comment: document.getElementById("comment_newDate").value
        };
        fetch("http://localhost:8080/date/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newDay)
        })
            .then(response => response.json())
            .then(data => this.setState({newDay: data}))
        return newDay;
    }

    // edit a day and add amount to category
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

/**
 * 
 * Render
 * 
 */
    // this creates the table from fetched data
    render(){
        let tableRows = this.state.dataByMonth.map((dataByMonth, listIndex)=>{
            const innerlist = dataByMonth.times.map((byCat, listIndex)=>{
                return(
                    <li key={listIndex} >{byCat.category.category}: {byCat.amount}</li>
                );
            });

            const innerlistSum = dataByMonth.times.map((byCat, listIndex)=>{
                // byCat.amount from HH:MM:SS to seconds
                let time = byCat.amount.split(':');
                let seconds = (+time[0]) * 60 * 60 + (+time[1]) * 60 + (+time[2]);
                return(
                    <li key={listIndex} >{seconds}</li>
                );
            });
            // sum of innerlistsSum
            let sum = 0;
            for (let i = 0; i < innerlistSum.length; i++) {
                sum += parseInt(innerlistSum[i].props.children);
            }
            // seconds to HH:MM:SS
            let hours = Math.floor(sum / 3600);
            let minutes = Math.floor((sum - (hours * 3600)) / 60);
            let seconds = sum - (hours * 3600) - (minutes * 60);
            // add 0 if minutes or seconds < 10
            if (minutes < 10) {minutes = "0" + minutes;}
            if (seconds < 10) {seconds = "0" + seconds;}
            let timeSum = hours + ':' + minutes + 'h';


            // single row of table
            return(
                <tr key={dataByMonth.id}>
                    <td>{dataByMonth.date}</td>
                    <td>{timeSum}</td>
                    <td><ul compact="compact">{innerlist}</ul></td>
                    <td>{dataByMonth.comment}</td>
                    <td>
                    <Button 
                            label="Hinzuf??gen" 
                            key={"add_"+listIndex} 
                            onClick={() => {toggle(); this.updateId(dataByMonth.id)}} />
                    <Button 
                            label="Bearbeiten" 
                            key={"edit_"+listIndex} 
                            onClick={() => {toggleEditDate(); this.setEditId(dataByMonth.id); this.setEditComment(dataByMonth.comment)}} />
                        <hr></hr>
                    <button
                            className="btn_delete" 
                            label="L??schen" 
                            key={"delete_"+listIndex} 
                            onClick={() => { this.removeDay(dataByMonth.id, listIndex); this.removeAllTimeByDayId(dataByMonth.id) }} >L??schen</button>
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

            function scrollTop() {
                window.scrollTo(0, 0);
            }

            return (
                <div className="component-container">
                {children} {scrollTop()}
                </div>
            );
        }
        // function for the toggled add new time to day
        function Edit({saveDayonEdit}) {
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
                <Button label="Speichern" onClick={saveDayonEdit} />
                <button className="btn_cancel" onClick={() => { toggle(); window.location.reload(); }} >Abbrechen</button>
              </div>
            );
          }

        //function to set default single day
        function setSingleDay(){
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            today = dd;
            return today;
        }
        //function to set default month
        function setMonth(){
            let today = new Date();
            let mm = String(today.getMonth() + 1).padStart(2, '0');
            today = mm;
            return today;
        }
        //function to set default year
        function setYear(){
            let today = new Date();
            let yyyy = today.getFullYear();
            today = yyyy;
            return today;
        }


        // function to toggle all the edit and create new stuff
        var hidden = true;
        function toggle() {
            hidden = !hidden;
            if(hidden){
                document.getElementById("EditHidden").style.visibility = "hidden";
                document.getElementById("EditHidden").style.display = "none";
                document.getElementById("CreateDay").style.visibility = "visible";
                document.getElementById("CreateDay").style.display = "block";
            }else{
                document.getElementById("EditHidden").style.visibility = "visible";
                document.getElementById("EditHidden").style.display = "block";
                document.getElementById("CreateDay").style.visibility = "hidden";
                document.getElementById("CreateDay").style.display = "none";
            }
        }

        // function to hide EditDate
        var EditDateHidden = true;
        function toggleEditDate() {
            EditDateHidden = !EditDateHidden;
            if(EditDateHidden){
                document.getElementById("editDate_comp").style.visibility = "hidden";
                document.getElementById("editDate_comp").style.display = "none";
                document.getElementById("CreateDay").style.visibility = "visible";
                document.getElementById("CreateDay").style.display = "block";
            }else{
                document.getElementById("editDate_comp").style.visibility = "visible";
                document.getElementById("editDate_comp").style.display = "block";
                document.getElementById("CreateDay").style.visibility = "hidden";
                document.getElementById("CreateDay").style.display = "none";
            }
        }


        // function 

        // creating the final table
        return (
            <div className="Timekeeper">
                <div className="editDate_comp" id="editDate_comp" hidden>
                    <EditDate date = {this.state.EditId} comment = {this.state.EditComment} />
                    <br/>
                    <button className="btn_cancel" onClick={() => { toggleEditDate(); window.location.reload(); }} >Abbrechen</button>
                </div>
                <div className="EditHidden" id="EditHidden" hidden>
                    <ToggleVisibility>{Edit({saveDayonEdit: this.saveDayonEdit})}</ToggleVisibility>
                </div>
            <div className='CreateDay' id="CreateDay">
                <form method="post"  name="createNewDayForm"  onSubmit= {this.submituserCreateNewForm}>
                    <div className="dates">
                        <label>Jahr</label>
                        <input type="text" id="year" name="year" list="todayYear" autoComplete="off" value={this.state.fields.year} onChange={this.handleChange}/>
                            <datalist id="todayYear">
                                <option value={setYear()}>Heute: {setSingleDay()}.{this.props.userInputMonth}{this.props.userInputYear}</option>
                            </datalist>
                        <div className="errorMsg">{this.state.errors.year}</div>
                    </div>
                    <div className="dates">
                    <label id="lbl_month">Monat</label>
                        <input type="text" id="month" name="month" list="todayMonth" autoComplete="off" value={this.state.fields.month} onChange={this.handleChange}/>
                        <datalist id="todayMonth">
                                <option value={setMonth()}>Heute: {setSingleDay()}.{this.props.userInputMonth}{this.props.userInputYear}</option>
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
                    <div className="btn_dates">
                    <br/>
                    <input type="submit" value="Tag Erstellen" className="submit" /> 
                    </div>
                    <div className="field_dates" id="hidden">
                       <label>Kommentar: </label>
                        <textarea rows="2" cols="67" maxLength={512} value={this.state.fields.comment} name="comment_newDate" id='comment_newDate' autoComplete="off" onChange={this.handleChange} /> 
                        <div className="errorMsg">{this.state.errors.comment}</div>
                    </div>
                </form>
            </div>
            <hr/>
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
                    { tableRows }
                </tbody>
            </table>
        </div>
        );
    }
}

export default Timekeeper;