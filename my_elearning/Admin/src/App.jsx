import './App.css'


import {Routes,Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import AdminLoginForm from './components/login/adminLogin'
import VideoList from './components/adminHome/videolist'
//import VideoList from './components/adminHome/videolist'
import Dashboard  from './components/adminHome/dashboard'
import UserProfile  from './components/adminHome/user'

import './App.css'

function App() {
  

  return (
    <main>
      <Routes>
        
        
        <Route path="/admin" element = {<AdminLoginForm/>}/>
        <Route path="/dashboard" element = {<Dashboard/>}/>
        <Route path="/dashboard/videoprofile" element = {<VideoList/>}/>
        <Route path="/dashboard/userprofile" element = {<UserProfile/>}/>
      </Routes>
      
    </main>
  )
}

export default App
