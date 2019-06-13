import React, { Component } from 'react';
import { Table, Form, FormGroup, Button, Input, Label, Alert} from 'reactstrap';
import moment from 'moment';

export default class Home extends Component{

    state = {
        transactions: [],
        categories: [],
        quantity: 0,
        category: 1,
        errorMessage: ''
    }

    componentDidMount () {
        this.getMonthTransactions();
        this.getCategories();
    }

    getCategories = () => {
        fetch('/api/categories')
            .then((res) => res.json())
            .then((resData) => {
                if(!resData.errorMessage){
                    let newCategories = [];
                    resData.categories.forEach((category) => {
                        newCategories[category.id - 1] = category;
                    });
                    console.log(newCategories);
                    this.setState({categories: newCategories, errorMessage: ''});
                }else{
                    this.setState({categories: [], errorMessage: resData.errorMessage});
                }
            });
    }

    getMonthTransactions = () => {
        let month = moment().month();
        fetch('/api/transactions/monthly/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                beginDate: moment().date(1).format('YYYY-MM-DD'),
                endDate: moment().month(month+1).date(1).format('YYYY-MM-DD')
            }) 
        })
        .then((res) => res.json())
        .then((resData) => {
            console.log(resData);
            if(!resData.errorMessage){
                this.setState({transactions: resData.transactions, errorMessage: ''});
            }else{
                this.setState({ errorMessage: resData.errorMessage});
            }
        });
        
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
        console.log(data);
        if(!data.errorMessage){
            this.setState({quantity: 0, category: 0, errorMessage: ''});
            this.getMonthTransactions();
        }else{
            this.setState({errorMessage: data.errorMessage, quantity: 0, category: 0});
        }
    } 

    printAlert = () => {
        return this.state.errorMessage === '' ?
        (<div> </div>)
        :
        (<Alert color="danger">{this.state.errorMessage}</Alert>)
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
                {this.printAlert()}
                <Table dark striped>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">CategoryId</th>
                            <th scope="col">Category</th>
                            <th scope="col">Type</th>
                            <th scope="col">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.transactions.map((transaction, index) => (
                            <tr key={index}>
                                <td>{transaction.id}</td>
                                <td>{transaction.quantity}</td>                                
                                <td>{this.state.categories[transaction.categoryId-1] ? this.state.categories[transaction.categoryId-1].id : ''}</td>
                                <td>{this.state.categories[transaction.categoryId-1] ? this.state.categories[transaction.categoryId-1].name : ''}</td>
                                <td>{this.state.categories[transaction.categoryId-1] ? this.state.categories[transaction.categoryId-1].type : ''}</td>
                                <td>{transaction.createdAt}</td>
                            </tr>
                        ))}
                        
                    </tbody>
                </Table>
            </div>
        );
    }
}