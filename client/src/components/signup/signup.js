import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { Redirect  } from 'react-router-dom';

export default class Signup extends Component {

    state = {
        username: '',
        phone: '',
        displayPhone: false,
        toHome: false,
        userId: 0
    }

    onSubmit = async (event) => {
        event.preventDefault();
        if(!this.state.displayPhone){
            const { user, errorMessage } = await fetch(`/api/users?username=${this.state.username}`);
            if(user){
                console.log('USER ALREADY EXISTS');
                //redirect to home
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
            <div className="col-md-6">
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
        :
        (<div></div>)
    }

    render () {
        return (
            
            <div id="signupRoot">
                {this.state.toHome ? 
                <Redirect to={{
                    pathname: '/home',
                    state: {userId: this.state.userId}
                }}/>
                : 
                <div></div>}
                
                <div className="row">
                    <div className="col-md-8">
                        <Form onSubmit={this.onSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
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
                                <div className="col-md-6">
                                    <FormGroup>
                                        <Button color="primary">Enter</Button>
                                    </FormGroup>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}