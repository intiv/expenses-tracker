import React, { Component } from 'react';
import { Table, Button, Form, FormGroup, Input, Label } from 'reactstrap';

export default class Home extends Component{

    state = {
        transactions: [],
        quantity: 0,

    }

    render () {
        return (
            <div id="homeRoot">
                <Form inline>
                    <FormGroup>
                        <Label for="transactionQty">Quantity</Label>
                        <Input type="number" min="0.01" step="0.01" 
                            value={this.state.quantity}
                            onChange={(event) => { this.setState({quantity: event.target.value}) }}
                            />
                    </FormGroup>
                    <FormGroup>
                        <Label for="transactionCatId">Category</Label>
                        <Input type="number"/>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}