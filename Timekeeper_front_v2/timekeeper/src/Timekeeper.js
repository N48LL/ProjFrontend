import React from 'react';
import Button from "./Button";
import './style/Timekeeper.css';

class Timekeeper extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            time: typeof props.time === 'undefined' ? [] : props.time,
            timeByCategory: typeof props.timeByCategory === 'undefined' ? [] : props.timeByCategory,
            timeSum: typeof props.timeSum === 'undefined' ? [] : props.timeSum,
        };
    }

    // fetch all data by month
    componentDidMount() {
        if (this.state.time == null || this.state.time.length === 0) {
            fetch("http://localhost:8080/time/" +this.props.userInput+ "/02/")
                .then(response => response.json())
                .then(data => this.setState({time: data}));
        }
        //fetch amount for each day by category
        if (this.state.timeByCategory == null || this.state.timeByCategory.length === 0) {
            fetch("http://localhost:8080/time/" +this.props.userInput+ "/02/09/sumbycategory")
                .then(response => response.json())
                .then(data => this.setState({timeByCategory: data}));
        }
        //fetch total amount for each day
        if (this.state.timeSum == null || this.state.timeSum.length === 0) {
            fetch("http://localhost:8080/time/" +this.props.userInput+ "/02/09/sum")
                .then(response => response.json())
                .then(data => this.setState({timeSum: data}));
        }
    }

            //refetch if month changes
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.userInput !== prevProps.userInput) {
            fetch("http://localhost:8080/time/" +this.props.userInput+ "/02/")
                .then(response => response.json())
                .then(data => this.setState({time: data}));
        }
        if (this.props.userInput !== prevProps.userInput) {
            fetch("http://localhost:8080/time/" +this.props.userInput+ "/02/09/sumbycategory")
                .then(response => response.json())
                .then(data => this.setState({timeByCategory: data}));
        }
        if (this.props.userInput !== prevProps.userInput) {
            fetch("http://localhost:8080/time/" +this.props.userInput+ "/02/09/sum")
                .then(response => response.json())
                .then(data => this.setState({timeSum: data}));
        }
    }
    
    render(){
        // timeByCategory
        // TODO: need help
        let tByCat = this.state.timeByCategory;
        let TimeByCategoryItems = tByCat.map((tByCat, listIndex)=>{
            return(
                <p key={listIndex}>{tByCat.category} : {tByCat.amount}</p>
            );
        });

        // timeSum
        let tSum = this.state.timeSum;

        let tRows = this.state.time.map((time, listIndex)=>{
            return(
                <tr key={time.id}>
                    <td>{time.entryDate.date}</td>
                    <td>{tSum}</td>
                    <td>{TimeByCategoryItems}</td>
                    <td>{time.entryDate.comment}</td>
                    <td>
                        <Button 
                            label="Löschen" 
                            key={"delete_"+listIndex} 
                            onClick={() => this.removeTime(time.id, listIndex)} />
                            <Button 
                            label="Bearbeiten" 
                            key={"edit_"+listIndex} 
                            onClick={() => this.props.editTime(time.id)} />
                    </td>
                </tr>
            );
        });

        return (
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
                <tfoot>
                    <tr>
                    <td>
                     <input type="text" ></input>
                     </td>
                     <td>
                        <input type="text"></input>
                        </td>
                        <td>
                        <input type="text"></input>
                        </td>
                        <td>
                        <input type="text"></input>
                        </td>
                        <td>
                         <Button
                            label="Create"
                            key={"create_t"}
                            onClick={() => this.addTime()} />
                         </td>
                    </tr>
                </tfoot>
            </table>
        );
    }
}

export default Timekeeper;