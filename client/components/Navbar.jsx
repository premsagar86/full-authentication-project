import React from 'react'
import {Link, Outlet} from "react-router-dom"

const Navbar = () => {
  return (
    <>
    <div className="h-20 items-center justify-center gap-3 border-4 py-5 bg-zinc-900 opacity-75 border-zinc-400 rounded-lg">
      <ul className="flex space-x-4 justify-evenly items-center ">
        <li className='text-gray-400  text-2xl list-none'><Link to="/Signup">SignUp</Link> </li>
        <li className='text-gray-400 text-2xl list-none'><Link to="/Signin">SignIn</Link> </li>
        <li className='text-gray-400  text-2xl list-none'><Link to="/Signup">SignUp</Link> </li>
        <li className='text-gray-400 text-2xl list-none'><Link to="/Signin">SignIn</Link> </li>
        
      </ul>
    </div>
    <Outlet/>
    </>
  )
}

export default Navbar