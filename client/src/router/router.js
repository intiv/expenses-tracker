import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Home from '../components/home/home';
import Signup from '../components/signup/signup';
import Report from '../components/report/report';

export const router = (
    <Router>
        <Switch>
            <Route exact path='/' component={Signup}/>
            <Route path='/home' component={Home}/>
            <Route path='/report' component={Report}/>
            <Redirect to={{pathname: '/', state: {invalid: true}}}/>
        </Switch>
    </Router>
)