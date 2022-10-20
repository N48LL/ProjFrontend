import React, { Component } from 'react';

export default class EditDate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            postId: null,
            textareaValue: ''
        };
        this.updateDay = this.updateDay.bind(this);
    }


    // Load initial Comment Value to make texztarea editable
    componentDidUpdate(prevProps, prevState) {
        if (this.props.date !== prevProps.date) {
            this.setState({
                textareaValue: this.props.comment
            })
        }
    }

    // change textarea value on user input
    handleOnChange(event) {
        this.setState({
          textareaValue: event.target.value
        })
      }


    // Update day's comment
    updateDay() {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                comment: this.state.textareaValue
            })
        };
        fetch("http://localhost:8080/date/update/" +this.props.date, requestOptions)
            .then(response => response.json())
            .then(data => this.setState({ postId: data.id }));
            
    }
    
    render() {
        return (
        <div>
            <h1>Kommentar Bearbeiten</h1>
            <form method='put' name='updateDayForm' onSubmit={this.updateDay}>
                <textarea
                    type="text"
                    id='commentEdit'
                    maxLength={512} 
                    value={this.state.textareaValue} 
                    onChange={(event) => this.handleOnChange(event)} />
                <div>
                    <br />  
                    
                    <input type="submit" value="Speichern" className="submit" id='comment' />
                </div>
            </form>
        </div>
        );
    }
}