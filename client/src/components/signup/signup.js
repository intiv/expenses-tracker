import React, { Component } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';

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
            
        }
    }

    renderPhone = () => {
        return this.state.displayPhone ? 
        (<FormGroup>
            <Label>
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
                            <Input 
                                type="text" 
                                name="signupUsername" 
                                value={this.state.username}
                                onChange={(event) => {this.setState({username: event.target.value})}}
                            ></Input>
                            Enter your username
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