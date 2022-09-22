import './App.css';
import { Routes, Route, Outlet, } from 'react-router-dom'

import GameSession from './GameSession.js'
import Home from './Home.js';
import TableContainer from './TableContainer.js';
import AboutUs from './AboutUs.js';
import NotFound from './NotFound';
import GlobalNavigation from './GlobalNavigation';


const questions = [
  {
    question: "Der erste Begriff im Buchstabier-Alphabet ist...",
    answers: ["Anton", "Alfa", "Anne"],
    correct_answer: "Alfa",
  },
  {
    question: "Der zweite Begriff im Buchstabier-Alphabet ist...",
    answers: ["Butter", "Beta", "Bravo"],
    correct_answer: "Bravo",
  },
  {
    question: "Der dritte Begriff im Buchstabier-Alphabet ist...",
    answers: ["Caesar", "Charlie", "Culprit"],
    correct_answer: "Charlie",
  },
]



function App(props) {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="quiz" element={<GameSession questions={ questions } />} />
        <Route path="tablecontainer" element={<TableContainer />} />
        <Route path="aboutus" element={<AboutUs />} />
      </Route>
      <Route path="*" element={<NotFound />}/>
    </Routes>
  );
}

function Layout(){
  return (
    <div className="App">
      <GlobalNavigation />
      <div className="content">
        <header className="App-header">
          <h1>Hi </h1>
          <hr/>
          <Outlet />
          <hr/>
        </header>
      </div>
    </div>
  );
}

export default App;
