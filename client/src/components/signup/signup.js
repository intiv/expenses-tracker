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
        (<FormGroup>
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
        </FormGroup>)
        :
        (<div></div>)
    }

    render () {
        return (
            <div id="signupRoot">
                <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                        <Label>
                            Enter your username
                            <Input 
                                type="text" 
                                name="signupUsername" 
                                value={this.state.username}
                                onChange={(event) => {this.setState({username: event.target.value})}}
                            ></Input>
                            
                        </Label>
                    </FormGroup>
                    {this.renderPhone()}
                    <FormGroup>
                        <Button color="primary">Enter</Button>
                    </FormGroup>
                </Form>
            </div>
        )
    }
}