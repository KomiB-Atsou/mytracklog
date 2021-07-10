import React, {useEffect, useState} from 'react';
import './App.css';
import {Route, Switch, BrowserRouter, Redirect, useHistory} from 'react-router-dom';
import Header from "./components/Header";
import CalendarView from "./components/CalendarView";
import TreeView from "./components/TreeView";
import NoCategorySelected from "./components/NoCategorySelected";
import categoryService from "./services/category";
import {swalError} from "./utils/swal";
import Task from "./components/Task";
import taskService from "./services/task";
import moment from "moment";
import Auth from "./components/Auth/Auth"
import _ from "lodash";
import { Container } from '@material-ui/core';
import $ from "jquery";
import Home from './components/Home/Home';
//const history = useHistory();

function App() {
    const user = JSON.parse(localStorage.getItem('profile'));
    

    const requireAuth = (nextState, replace) =>   {
        if(!this.authenticated()) // pseudocode - SYNCHRONOUS function (cannot be async without extra callback parameter to this function)
        replace('/login');
    }
    
    useEffect(() => {
       /*  const token = localStorage.getItem('profile');
        if(!token) {
            history.push('/login');
        } */
       
    }, []);   

   

    return (

        <BrowserRouter>
        <Container maxWidth="xl">

        <Switch>
            <Route path="/" exact render={() => 
                {
                    if(localStorage.getItem('profile')){
                        console.log('yes');
                        return  (<Home/>)
                    }else {
                        console.log('no');
                        return (<Redirect to="/login" />)
                    }
                    
                }} />
            <Route path="/tasks" exact component={Home} />
            <Route path="/tasks/search" exact component={Home} />
            <Route path="/login" exact component={Auth} />        
         
        </Switch>
      
        {/* <Switch>
            <Route path="/" exact component={Home} onEnter={requireAuth} />
            <Route path="/tasks" exact component={Home} onEnter={requireAuth}/>
            <Route path="/tasks/search" exact component={Home} />
            <Route path="/login" exact component={Auth} />     
            <Route path="/login" exact component={Auth} />   
         
        </Switch> */}
      </Container>    
        </BrowserRouter>
    );
}

export default App;
