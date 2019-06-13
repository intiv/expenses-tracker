import React, { Component } from 'react';
import { Table, Form, FormGroup, Button, Input, Label, Alert } from 'reactstrap';
import moment from 'moment';

export default class Home extends Component{

    state = {
        transactions: [],
        quantity: 0,
        category: 1,
        errorMessage: ''
    }

    async componentDidMount () {
        await this.getMonthTransactions();
    }

    getMonthTransactions = async () => {
        let month = moment().month();
        let response = await fetch('/api/transactions/monthly/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                beginDate: moment().date(1).format('YYYY-MM-DD'),
                endDate: moment().month(month+1).date(1).format('YYYY-MM-DD')
            
            }) 
        });
        let data = await response.json();
        if(!data.errorMessage){
            this.setState({transactions: data.transactions});
        }else{
            this.setState({transactions: [], errorMessage: data.errorMessage});
        }
    }

    onSubmit = async (event) => {
        event.preventDefault();
        let response = await fetch('/api/transactions/create/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({transaction: {quantity: this.state.quantity, categoryId: this.state.category}})
        });
        let data = await response.json();
        if(!data.errorMessage){
            this.setState({transactions: data.transactions});
        }else{
            this.setState({errorMessage: data.errorMessage, quantity: 0, category: 0});
        }
    } 

    

    render () {
        return (
            <div id="homeRoot" className="dark-background">
                <Form inline className="mb-4 mt-4" onSubmit={this.onSubmit}>
                    <FormGroup className="mr-2">
                        <Label for="transactionQty" className="mr-1">Quantity</Label>
                        <Input type="number" min="0.01" step="0.01" 
                            value={this.state.quantity}
                            onChange={(event) => { this.setState({quantity: event.target.value}) }}
                            />
                    </FormGroup>
                    <FormGroup>
                        <Label for="transactionCatId" className="mr-1">Category</Label>
                        <Input type="number" min="1" step="1"
                            value={this.state.category} 
                            onChange={(event) => { this.setState({category: event.target.value }) }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary">Add</Button>
                    </FormGroup>
                </Form>
                {}
                <Table dark striped>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">CategoryId</th>
                            <th scope="col">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.transactions.map((transaction, index) => (
                            <tr key={index}>
                                <td>{ transaction.id }</td>
                                <td>{ transaction.quantity }</td>
                                <td>{ transaction.categoryId }</td>
                                <td>{ transaction.createdAt }</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        );
    }
}