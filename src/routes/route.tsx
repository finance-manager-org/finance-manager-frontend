import { BrowserRouter,Routes,Route } from 'react-router-dom';
import React from 'react';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

const RoutesPages = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<LandingPage/>}/>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='/register' element={<RegisterPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}