import './style/App.css';
import { Routes, Route, Outlet, } from 'react-router-dom'
import GlobalNavigation from './GlobalNavigation';

import Timekeeper from './Timekeeper';
import NotFound from './NotFound';
import React from 'react';


function callbackFunction(childData) {
  this.setState({selectedYear: childData})
}
const selectedYear = 2099;

     // TODO: need help for callback child<->parent or sibling<->sibling for selectedYear

function App(props) {
  React.state = { selectedYear: 2022 }
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Timekeeper selectedYear={selectedYear} />} />
      </Route>
      <Route path="*" element={<NotFound />}/>
    </Routes>
  );
}

function Layout(){
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

export default App;
