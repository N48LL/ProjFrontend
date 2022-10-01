import './style/App.css';
import { Routes, Route} from 'react-router-dom'

import Timekeeper from './Timekeeper';
import NotFound from './NotFound';
import React from 'react';
import Layout from './Layout';

     // TODO: need help for callback child<->parent or sibling<->sibling for selectedYear

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }


  render(){
      return (
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<Timekeeper />} />
          </Route>
          <Route path="*" element={<NotFound />}/>
        </Routes>
      );
    }
}
export default App;
