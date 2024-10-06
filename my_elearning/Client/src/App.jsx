import './App.css'
import Corousel from './components/Pages/homePage/Corousel.jsx'
//import Navbar from './components/Pages/Navbar.jsx'

import {Routes, Route, useNavigate} from 'react-router-dom'
import LoginForm from './components/Pages/login/LoginForm'
import { useState, useEffect } from 'react';
import Register from './components/Pages/registration/Register'
import VideoComponent from './components/Pages/homePage/mylearning'
import VideoDetails from './components/Pages/homePage/Videodetail'
//import Corousel from './components/Pages/Corousel'
//import { AuthProvider } from './AuthContext';
import './App.css'
//import VideoForm from './components/Pages/VideoForm'
function App() {

  // const [userId, setUserId] = useState(null);
  // const [isloggedIn, setIsLoggedIn] = useState(false)
  // useEffect(() => {
  //   // Check if userId is present in localStorage
  //   const storedUserId = localStorage.getItem('userid');
  //   if (storedUserId) {
  //     setUserId(storedUserId);
  //     setIsLoggedIn(true);
  //   }
  // }, []);

  // const navigate = useNavigate();

  // Redirect to login if userId is not present
  // if (userId) {
  //   navigate ('/login');
  // }
  

  

  return (
    
    <main>
      <Routes>
        
        <Route path="/login" element = { <LoginForm/> }/>
        <Route path="/register" element = {<Register/>}/>
        {/* {isloggedIn ? ( */}
          <Route path="/home" element = {<Corousel/>}/>,
        
          <Route path="/home/mylearning" element = {<VideoComponent/>}/>,
          <Route path="/home/video/:videoUrl" element = {<VideoDetails/>}/>
        {/* ):(navigate('/login'))} */}
        
        
      </Routes>
      
    </main>
    
  )
}

export default App
