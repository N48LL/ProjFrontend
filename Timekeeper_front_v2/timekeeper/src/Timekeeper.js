import React from 'react';
import Button from "./Button";
import './style/Timekeeper.css';

class Timekeeper extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            dataByMonth: typeof props.dataByMonth === 'undefined' ? [] : props.dataByMonth,
            timeSum: typeof props.timeSum === 'undefined' ? [] : props.timeSum,
            categories: typeof props.categories === 'undefined' ? [] : props.categories,
        };

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


        //function to set defaultValuo of today
        function setToday(){
            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            let yyyy = today.getFullYear();
            today = yyyy + '-' + mm + '-' + dd;
            return today;
        }

        // create table
        return (
            <div className="Timekeeper">
            <div className='new'>
                <form onSubmit>
                    <label>
                        Datum:
                        <input type="date" name="date" id="date" defaultValue={setToday()} />
                    </label>
                    <label>
                        Kategorie:
                        <select name="category">
                            <option value="1">Arbeit</option>
                            <option value="2">Freizeit</option>
                            <option value="3">Schule</option>
                        </select>
                    </label>
                    <label>
                        Zeit:<br/>
                        <input type="time" name="time" step="2" className='time' defaultValue="00:00:00"/>
                    </label>
                    <label>
                        Kommentar:
                        <textarea rows="2" cols="85" name="comment" />
                    </label>
                    <hr/>
                    <input type="submit" value="Hinzufügen" className='submit'/>
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