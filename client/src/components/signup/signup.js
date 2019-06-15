import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

export default class Signup extends Component {

    state = {
        username: '',
        phone: '',
        displayPhone: false
    }

    onSubmit = async (event) => {
        event.preventDefault();
        let { user, errorMessage } = await fetch(`/api/users?username=${this.state.username}`);
        if(user){
            //redirect to home
        }else{
            this.setState({displayPhone: true});
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