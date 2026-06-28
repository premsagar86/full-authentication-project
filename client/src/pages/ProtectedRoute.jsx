import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/me");
        if (!res.data.isAuthenticated) {
          navigate("/signin");
        }
      } catch {
        // interceptor already tried refresh; if we're here, both failed
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;
  return children;
};
export default ProtectedRoute;
/* import React from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';

const ProtectedRoute = ({children}) => {
    const navigate = useNavigate();
    const isAuthenticated = Cookies.get("accessToken");

    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate("/signin");
        }
    }, [isAuthenticated, navigate]);

    return children ;
}

export default ProtectedRoute; */

/* import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!Cookies.get("accessToken");

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    return children;
};

export default ProtectedRoute; */