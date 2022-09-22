import React from 'react';
import Button from "./Button";
import './style/TableContainer.css';

class TableContainer extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            time: typeof props.time === 'undefined' ? [] : props.time
        };
    }

    componentDidMount() {
        if (this.state.time == null || this.state.time.length == 0) {
            fetch("http://localhost:8080/time/all")
                .then(response => response.json())
                .then(data => this.setState({time: data}));
        }
    }
/**
    removeQuestion(questionId, listIndex){
        fetch("http://localhost:8080/questions/" + questionId, { method:"DELETE"})
            .then(() => {
                this.setState(({ questions }) => {
                    const tempQuestions = [...questions];
                    tempQuestions.splice(listIndex,1);
                    return { questions: tempQuestions };
                });
            });
    }

    addQuestion(){
        const newQuestion = {
            question: "New Question",
            answers: ["Answer 1", "Answer 2", "Answer 3"],
            correct_answer: "Answer 1"
        };
        fetch("http://localhost:8080/questions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newQuestion)
        })
            .then(response => response.json())
            .then(data => {
                this.setState(({ questions }) => {
                    const tempQuestions = [...questions];
                    tempQuestions.push(data);
                    return { questions: tempQuestions };
                });
            });
    }
*/
    render(){

        let questionRows = this.state.time.map((time, listIndex)=>{
            return(
                <tr key={time.id}>
                    <td>{time.id}</td>
                    <td>{time.entryDate.comment}</td>
                    <td>

                    </td>
                    <td>{time.amount}</td>
                    <td>
                        <Button 
                            label="Löschen" 
                            key={"delete_"+time.id} 
                            onClick={() => this.removeTime(time.id, listIndex)} />
                            <Button 
                            label="Bearbeiten" 
                            key={"edit_"+time.id} 
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
                    { questionRows }
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
                            key={"create_question"}
                            onClick={() => this.addTime()} />
                         </td>

                    </tr>
                </tfoot>
            </table>

        );
    }
}

export default TableContainer;