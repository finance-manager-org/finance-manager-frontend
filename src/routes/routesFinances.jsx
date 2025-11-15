import { BrowserRouter,Routes,Route } from 'react-router-dom';
import React from 'react';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CalendarPage from '../pages/CalendarPage';
import DashboardPage from '../pages/DashboardPage';
import { TagsPage } from '../pages/TagsPage';

const RoutesPages = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<LandingPage/>}/>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='/register' element={<RegisterPage/>}/>
                <Route path='/calendar' element={<CalendarPage/>}/>
                <Route path='/dashboard' element={<DashboardPage/>}/>
                <Route path='/tags' element={<TagsPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}