import './style/App.css';
import { Routes, Route, Outlet, } from 'react-router-dom'
import { render } from '@testing-library/react';
import React from 'react';
import App from './App';


export default class Layout extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            //todo: add stuff
        }
    }

    render(){

        return (
        <div className="App">
            <header className="App-header">
            <h1>Timekeeper</h1>
            </header>
            <GlobalNavigation selectedYear={selectedYear} parentCallback = {callbackFunction}/>
            <div className="content">
            <header className="App-header">
                <hr/>
                <p>{selectedYear}</p>
                <Outlet />
                <hr/>
            </header>
            </div>
        </div>
        );
    }
  }
