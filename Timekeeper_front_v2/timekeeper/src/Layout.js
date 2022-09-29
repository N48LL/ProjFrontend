import './style/App.css';
import { Routes, Route, Outlet, } from 'react-router-dom'
import { render } from '@testing-library/react';
import React from 'react';
import App from './App';
import GlobalNavigation from './GlobalNavigation';
import Timekeeper from './Timekeeper';


export default class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedYear: this.props.selectedYear,
            userInput: '2022'
        }
    }

    changeuserInput = (viewYear) => {
        this.setState({ userInput: viewYear });
    }


    render() {

        return (
            <div className="App">
                <header className="App-header">
                    <h1>Timekeeper</h1>
                </header>
                <GlobalNavigation changeuserInput={this.changeuserInput} />
                <div className="content">
                    <header className="App-header">
                        <hr />
                        <Timekeeper userInput={this.state.userInput} />
                        <hr />
                    </header>
                </div>
            </div>
        );
    }
}
