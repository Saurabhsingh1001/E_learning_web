import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
 
export default function LoginForm() {
 
 
  const [email,setEmail]=useState()
  const[password,setPassword]=useState()
  const[errorMessage,setErrorMessage]=useState()
  const navigate =useNavigate()


  async function Submit(e) {
    e.preventDefault();
  
    // Validation
    if (!email || !password) {
      setErrorMessage("All fields are required to be filled!!");
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format");
      return;
    }
  
    try {
      await axios.post("http://localhost:8000/admin", { email, password });
      console.log("hii");

      // If the request is successful, navigate to the dashboard
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "An error occurred");
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
            <img id="image"src="image1.png"alt="" style={{height:"340px"}}/> 
          </div>
 
          <div className='col-1'>
           
            <h1 >Login</h1>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
 
            <form onSubmit={Submit} id='form' className='flex flex-col'>
              <input type="email" placeholder='Email'onChange={(e)=>setEmail(e.target.value)} />
              <input type="password" placeholder='Password' onChange={(e)=>setPassword(e.target.value)}/>
              <button type="submit" className='btn '>Login</button>
             
            </form>
 
          </div>
   
        </div>
      </section>
  )
}