import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import { useAuth } from '../../../AuthContext'; // Import the useAuth hook
import Swal from 'sweetalert2'
export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();


  function handleclick() {
    navigate('/register');
  }

  async function Submit(e) {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage('All fields are required to be filled!!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Invalid email format');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      console.log('login data: ',response.data);
      if (response.data.token) {
        // Use the login function to set the user as authenticated
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userid', response.data.user._id);
        console.log(response)
        Swal.fire({
          position: "top-end",
          icon: "success",
          height:"100px",
          widht:"300px",
          title: "Successfully logged In",
          showConfirmButton: false,
          timer: 1500
        });
        navigate('/home');
      } else {
        setErrorMessage('Invalid email or password');
      }
    } catch (error) {
      setErrorMessage('Username or password is incorrect');
      console.error(error);
    }
  }

  return (
    <section>
      <div className="login">
        <div className="col-2">
          <video autoPlay loop muted id="videopart">
            <source src="video1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="custom-div1" onClick={handleclick}>
            <h2 id="videohead1">New User</h2>
          </div>
        </div>

        <div className="col-1">
          <h2 id="loginheading">Login</h2>

          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <form onSubmit={Submit} id="form" className="flex flex-col">
            <input type="email" placeholder="username" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" className="btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
