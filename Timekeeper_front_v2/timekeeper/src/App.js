import './style/App.css';
import { Routes, Route, Outlet, } from 'react-router-dom'
import GlobalNavigation from './GlobalNavigation';

import Timekeeper from './Timekeeper';
import NotFound from './NotFound';
import React from 'react';
import Layout from './layout';


function callbackFunction(childData) {
  this.setState({selectedYear: childData})
}
const selectedYear = 2099;

     // TODO: need help for callback child<->parent or sibling<->sibling for selectedYear

class App extends React.Component {

  render(){
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
}
export default App;
