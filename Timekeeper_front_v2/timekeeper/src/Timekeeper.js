import React from 'react';
import Button from "./Button";
import './style/Timekeeper.css';

class Timekeeper extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            dataByMonth: typeof props.dataByMonth === 'undefined' ? [] : props.dataByMonth,
            timeSum: typeof props.timeSum === 'undefined' ? [] : props.timeSum,
        };
    }

    // fetch all data by month
    componentDidMount() {
        if (this.state.dataByMonth == null || this.state.dataByMonth.length === 0) {
            fetch("http://localhost:8080/date/" +this.props.userInput+ "/01/")
                .then(response => response.json())
                .then(data => this.setState({dataByMonth: data}));
        }
        //fetch total amount for each day
        if (this.state.timeSum == null || this.state.timeSum.length === 0) {
            fetch("http://localhost:8080/time/" +this.props.userInput+ "/01/01/sum")
                .then(response => response.json())
                .then(data => this.setState({timeSum: data}));
        }
    }

            //refetch if month changes
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.userInput !== prevProps.userInput) {
            fetch("http://localhost:8080/date/" +this.props.userInput+ "/01/")
                .then(response => response.json())
                .then(data => this.setState({dataByMonth: data}));
        }
        if (this.props.userInput !== prevProps.userInput) {
            fetch("http://localhost:8080/time/" +this.props.userInput+ "/01/01/sum")
                .then(response => response.json())
                .then(data => this.setState({timeSum: data}));
        }
    }


    render(){
        // dataByDay


        // timeSum
        let tSum = this.state.timeSum;
        let tRows = this.state.dataByMonth.map((dataByMonth, listIndex)=>{
            const innerlist = dataByMonth.times.map((byCat, listIndex)=>{
                return(
                    <li key={listIndex} >{byCat.category.category}: {byCat.amount}</li>
                );
            });

            return(
                <tr key={dataByMonth.id}>
                    <td>{dataByMonth.date}</td>
                    <td>{tSum}</td>
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