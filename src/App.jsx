import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Home from './page/Home'
import Signin from './component/Signin';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import ProfilePage from './component/ProfilePage';


function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  )
}

export default App;
