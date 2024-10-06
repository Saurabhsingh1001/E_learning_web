//import React from'react'

import './NavLogSign.css'
//import { AiOutlineLogin } from "react-icons/ai";
import { NavLink, useLocation } from 'react-router-dom'

const NavLogSign = () =>{

 const location = useLocation();

   

 

     return(

        <nav id="navlogin">

             <div className='logo-header'>

             <div className="nav-logo-container">
            <img src="logoo.png" alt="Logo" />
                </div>

            </div>

 

            <ul>

                <li className="nav-link ">

                <NavLink
                    to={location.pathname === '/login' ? '/register' : '/login'}
                    className={({ isActive }) =>
                        isActive ? 'active' : ''
                    }
                    >
                    {location.pathname === '/register' ? 'Sign In' : 'Sign Up'}
                </NavLink>
                    

                </li>

          </ul>

        </nav>

    )

}
export default NavLogSign