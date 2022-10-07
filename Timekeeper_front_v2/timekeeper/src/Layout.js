import './style/App.css';
import React from 'react';
import GlobalNavigation from './GlobalNavigation';
import Timekeeper from './Timekeeper';


export default class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInputYear: new Date().getFullYear(),
            userInputMonth: new Date().getMonth() + 1,
        }
    }

    //function to bind to child - passes data from child to parent
    changeuserInputYear = (viewYear) => {
        this.setState({ userInputYear: viewYear });
    }
    changeuserInputMonth = (viewMonth) => {
        this.setState({ userInputMonth: viewMonth });
    }


    // main render function
    // passes <select> data(year/month) from parent to child
    // Outlet us not used - router inly used for catching 404
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1>Timekeeper</h1>
                </header>
                <GlobalNavigation changeuserInputYear={this.changeuserInputYear} changeuserInputMonth={this.changeuserInputMonth}/>
                <div className="content">
                    <header className="App-header">
                        <hr />
                        <Timekeeper userInputYear={this.state.userInputYear} userInputMonth={this.state.userInputMonth}/>
                        <hr />
                    </header>
                </div>
            </div>
        );
    }
}
