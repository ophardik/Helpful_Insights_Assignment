import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './Components/Pages/Home';
import Form from './Components/Pages/Form';


function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/addNewCandidate" element={<Form />} />
   </Routes>
   </BrowserRouter>
  );
}

export default App;
