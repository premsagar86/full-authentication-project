import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();

  const signout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/logout", {}, { 
        withCredentials: true 
      });
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-linear-to-tr to-blue-950 via-zinc-950 from-blue-900 relative overflow-hidden">

      <div className="flex items-center space-x-4">
      
        <h1 className="text-2xl font-bold text-amber-50">Welcome to the Home Page!</h1>
      </div>
      <div className="mt-4">
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer" 
          onClick={signout}
        >
          Signout
        </button>
      </div>
      </div>
    </>
  );
};

export default Home;