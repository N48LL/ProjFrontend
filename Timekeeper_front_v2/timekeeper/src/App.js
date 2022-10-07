import './style/App.css';
import { Routes, Route} from 'react-router-dom'

import Timekeeper from './Timekeeper';
import NotFound from './NotFound';
import React from 'react';
import Layout from './Layout';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

    // Outlet us not used - router only used for catching 404
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
