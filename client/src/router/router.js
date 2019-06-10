import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router-dom';
import Categories from '../components/categories/categories';
import Home from '../components/home/home';

export const router = (
    <Router>
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/api/categories" component={Categories}/>
        </Switch>

    </Router>
)