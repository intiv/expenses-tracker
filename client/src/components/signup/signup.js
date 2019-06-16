import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { Redirect  } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

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
            const { user, errorMessage } = await response.json();
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
                console.log('ERROR: ',data.errorMessage);
            }
        }
    }

    renderPhone = () => {
        
        return this.state.displayPhone ? 
        (<div className="row">
            <div className="col-md-6 ml-2">
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
            </div>
        </div>)
        : null
    }

    cancel = () => {
        this.setState({displayPhone: false});
    }


    render () {
        return (
            
            <div id="signupRoot">
                {this.state.toHome ? 
                <Redirect to={{
                    pathname: '/home',
                    state: {userId: this.state.userId}
                }}/>
                : null}
                
                <div className="row">
                    <div className="col-md-8 mt-2">
                        <Form onSubmit={this.onSubmit}>
                            <div className="row">
                                <div className="col-md-6 ml-2">
                                    <FormGroup>
                                        <Label>Enter your username</Label>
                                        <Input 
                                            type="text" 
                                            name="signupUsername" 
                                            value={this.state.username}
                                            onChange={(event) => {this.setState({username: event.target.value})}}
                                            disabled={this.state.displayPhone}
                                            
                                        ></Input>
                                    </FormGroup>
                                </div>
                            </div>

                            {this.renderPhone()}
                            
                            <div className="row">
                                <div className="col-md-1 ml-2">
                                    <FormGroup>
                                        <Button color="primary" type="submit">Enter</Button>
                                    </FormGroup>
                                </div>
                                {this.state.displayPhone?
                                (<div className="col-md-2">
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