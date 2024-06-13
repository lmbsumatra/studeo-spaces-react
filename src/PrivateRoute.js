import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token'); // Check if the user is authenticated
if(!isAuthenticated) {
            return <Navigate to='/login' />
        }
    return children
};

export default PrivateRoute;
