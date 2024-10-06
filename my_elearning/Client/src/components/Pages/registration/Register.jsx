import { useState } from "react";

import  "../../../App.css";

//import book from '../Assets/book.jpg'

import NavLogSign from '../navbar/NavLogSign'

import { useNavigate } from "react-router-dom";
import axios from 'axios';
 

export default function Register(){

 
  function handleClick(){
    navigate('/login');
  }
  const [name,setName]=useState("")

  const[password,setPass]=useState("")

  const[email,setEmail]=useState("")
  const[errorMessage, setErrorMessage] = useState("")
  const navigate =useNavigate()

  async function Submit(e) {
    e.preventDefault();
 
    if (!name || !email || !password) {
      setErrorMessage("All fields are required to be filled!!");
      return;
    }
 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/;
    if (!passwordRegex.test(password)) {
    setErrorMessage(
      "Password must be at least 6 characters and contain upper, lower ,special character."
    );
    return;
    }
 
    try {
      const response = await axios.post("http://localhost:5000/api/signUp", { name, email, password });
     
      if (!response.data.success) {
        setErrorMessage(response.data.message);
      } else {
        setErrorMessage("");
        navigate('/login');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred");
      }
      console.error(error);
    }
  }

  

 

  

return(

    <section>

      

    <div className='register'>

    <div className='col-2'>

    <video autoPlay loop muted id="videopart">
    
    <source src="video2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
    </video>


    </div>

    <div className='col-1'>

    <h2>Register</h2>
    {errorMessage && <div className="error-message">{errorMessage}</div>}

 

    <form onSubmit={Submit}id='form' className='flex flex-col'>

        <input type="text" placeholder='Username' onChange={(e)=>setName(e.target.value)} />

        <input type="email" placeholder="Email-id" onChange={(e)=>setEmail(e.target.value)}/>

        <input type="password" placeholder='Password'onChange={(e)=>setPass(e.target.value)}/>
        <div className="btnid" style={{display:"flex", alignItems:"center", justifyContent:"center", width:"600px", marginLeft:"-197px", gap:"10px"}}>
        <button type="Submit" className='btn' style={{width:"100px",padding:"8px",backgroundColor:"black" , color:"white"}}>Register</button>
        <button type="button" className='btn1' onClick={handleClick} style={{padding:"1px", backgroundColor:"black" , color:"white"}}>Login</button></div>

      

    </form>

    </div>

   

    </div>

   </section>

)

}