import { NavLink } from "react-router-dom";
import './dashboard.css'

import { React, useState, useRef, useEffect } from 'react'

 
const DashSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sideNavRef = useRef(null);
 
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
 
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
 
    function handleClickOutside(event) {
        if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
            setIsSidebarOpen(false);
        }
    }
 
    return (
        <>
            <button
                onClick={toggleSidebar}
                className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-200 dark:focus:ring-gray-600"
            >
                <span className="sr-only">Open sidebar</span>
                <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                    ></path>
                </svg>
            </button>
 
            <aside
                ref={sideNavRef}
                id="default-sidebar"
                className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } sm:translate-x-0`}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 py-10 overflow-y-auto bg-gray-50 dark:bg-gray-800 sidebardiv">
                    <ul className="space-y-4 font-medium">
                        <li>
                            <NavLink
                                to="/dashboard"
                                className="flex items-center p-4 rounded-lg hover:bg-gray-100 group"
                                style={({ isActive }) => {
                                    return {
                                        backgroundColor: isActive ? "" : "lightgrey "
                                        };
                                    }}
                                >
                               
                               <span className="flex-1 ms-3 whitespace-nowrap text-black-900">Dash Board</span>
                            </NavLink>
                        </li>
 
                        <li>
                            <NavLink
                                to="/dashboard/videoprofile"
                                className="flex items-center p-4 rounded-lg hover:bg-gray-100 group"
                                style={({ isActive }) => {
                                    return {
                                        backgroundColor: isActive ? "lightgrey" : ""
                                        };
                                    }}
                                >
                               
                                <span className="flex-1 ms-3 whitespace-nowrap text-black-900">Video Profile</span>
                            </NavLink>
                        </li>
 
                        <li>
                            <NavLink
                                to="/dashboard/userprofile"
                                className="flex items-center p-4 rounded-lg hover:bg-gray-100 group"
                                style={({ isActive }) => {
                                    return {
                                        backgroundColor: isActive ? "lightgrey" : ""
                                        };
                                    }}
                                >
                               
                                <span className="flex-1 ms-3 whitespace-nowrap text-black-900">User Profile</span>
                            </NavLink>
                        </li>
 
                        <li className="logout-btn">
                            <NavLink
                             to="/admin" 
                             className="flex items-center p-4 rounded-lg hover:bg-gray-100 group">
                                <svg className="flex-shrink-0 w-5 h-5 text-gray-600 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/>
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Sign Out</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    )
}
 
export default DashSidebar