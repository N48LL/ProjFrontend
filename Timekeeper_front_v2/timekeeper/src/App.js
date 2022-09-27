import './style/App.css';
import { Routes, Route, Outlet, } from 'react-router-dom'
import GlobalNavigation from './GlobalNavigation';

import Timekeeper from './Timekeeper';
import NotFound from './NotFound';

function App(props) {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Timekeeper />} />
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
      <GlobalNavigation />
      <div className="content">
        <header className="App-header">
          <hr/>
          <Outlet />
          <hr/>
        </header>
      </div>
    </div>
  );
}

export default App;
