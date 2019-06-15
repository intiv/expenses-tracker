import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router-dom';
import Categories from '../components/categories/categories';
import Home from '../components/home/home';
import Signup from '../components/signup/signup';

export const router = (
    <Router>
        <Switch>
            <Route exact path="/" component={Signup}/>
             <Route path="/home" component={Home}/>
            {/*<Route path="/categories" component={Categories}/> */}
        </Switch>
        
    </Router>
)