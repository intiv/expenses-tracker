import React, { Component } from 'react';
import { Form, FormGroup, FormFeedback, Label, Input, Button } from 'reactstrap';
import { Redirect  } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import './signup.css';

export default class Signup extends Component {

    state = {
        username: '',
        phone: '',
        displayPhone: false,
        toHome: false,
        userId: 0,
        invalid: false
    }

    componentDidMount () {
        if(this.props.location.state && this.props.location.state.invalid){
            toast.error('You must enter your username first!');
        }
    }

    onSubmit = async (event) => {
        event.preventDefault();
        if(!this.state.displayPhone){
            const response = await fetch(`/api/users?username=${this.state.username}`);
            const { user } = await response.json();
            if(user){
                this.setState({userId: user.id, toHome: true});
            }else{
                this.setState({displayPhone: true});
            }
        }else{
            const response = await fetch('/api/users/create', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: {
                        username: this.state.username,
                        phone: this.state.phone
                    }
                })
            });
            const data = await response.json();
            if(!data.errorMessage && data.user){
                this.setState({userId: data.user.id, toHome: true});
            }else{
                toast.error('User could not be created. Username must be 3 to 12 characters long');
            }
        }
    }

    cancel = () => {
        this.setState({displayPhone: false, phone: ''});
    }


    render () {
        return (
            
            <div id="signupRoot" className="light-background signup-container">
                {this.state.toHome ? 
                <Redirect to={{
                    pathname: '/home',
                    state: {userId: this.state.userId}
                }}/>
                : null}
                
                <div className="row">
                    <div className="col-md-5 offset-md-3 mt-2">
                        <Form onSubmit={this.onSubmit} className="form-border">
                            <div className="row">
                                <div className="col-md-8 offset-md-3">
                                    <h3>Expenses Tracker - {this.state.displayPhone ? 'Singup' : 'Sign in'}</h3>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-10 offset-md-1">
                                    <FormGroup>
                                        <Label className="white-font">Enter your username</Label>
                                        <Input 
                                            type="text" 
                                            name="signupUsername" 
                                            value={this.state.username}
                                            onChange={(event) => {this.setState({username: event.target.value})}}
                                            disabled={this.state.displayPhone}
                                            invalid={this.state.username.length > 0 && (this.state.username.length < 3 || this.state.username.length > 12)}
                                            valid={this.state.username.length > 0 && !this.invalid}
                                        ></Input>
                                        <FormFeedback>Username must be 3 to 12 characters long!</FormFeedback>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-10 offset-md-1 ">
                                    {this.state.displayPhone ? 
                                    (
                                    <FormGroup>
                                        <Label>
                                            Enter your phone to send you notifications!
                                            <Input
                                                type="text"
                                                name="signupPhone"
                                                value={this.state.phone}
                                                onChange={(event) => {this.setState({phone: event.target.value})}}
                                            >
                                            </Input>
                                        </Label>
                                    </FormGroup>
                                    )   
                                    : null}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-1 offset-md-1">
                                    <FormGroup>
                                        <Button color="primary" type="submit">Enter</Button>
                                    </FormGroup>
                                </div>
                                {this.state.displayPhone?
                                (<div className="col-md-2 offset-md-1">
                                    <FormGroup>
                                        <Button color="secondary" onClick={this.cancel}>Cancel</Button>
                                    </FormGroup>
                                </div>) 
                                : null}
                            </div>
                        </Form>
                    </div>
                </div>
                <ToastContainer/>
            </div>
        )
    }
}