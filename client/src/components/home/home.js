import React, { Component } from 'react';
import { Table, Form, FormGroup, Button, Input, Label, Alert} from 'reactstrap';
import moment from 'moment';
import { Link, Redirect } from 'react-router-dom';

export default class Home extends Component{

    state = {
        transactions: [],
        categories: {},
        quantity: 0,
        category: 1,
        errorMessage: '',
        userId: 0,
        toSignup: false
    }

    componentDidMount = async () => {
        if(this.props.location.state){
            await this.setState({userId: this.props.location.state.userId});
            await this.getMonthTransactions();
            await this.getCategories();
        }else{
            await this.setState({toSignup: true})
        }   
    }

    getCategories = async () => {
        const response = await fetch(`/api/categories?userId=${this.state.userId}`);
        const data = await response.json();
        
        if(!data.errorMessage){
            let newCategories = {};
            data.categories.forEach((category, index) => {
                newCategories[category.id-1] = category;
            });
            this.setState({categories: newCategories, errorMessage: ''});
        }else{
            this.setState({categories: {}, errorMessage: data.errorMessage});
        }
            
    }

    getMonthTransactions = async () => {
        const month = moment().month();
        const response = await fetch(`/api/transactions/monthly?beginDate=${moment().date(1).format('YYYY-MM-DD')}&endDate=${moment().month(month+1).date(1).format('YYYY-MM-DD')}&userId=${this.state.userId}`)
        const data = await response.json();
        if(!data.errorMessage){
            this.setState({transactions: data.transactions, errorMessage: ''});
        }else{
            this.setState({ errorMessage: data.errorMessage});
        }
        
    }

    onSubmit = async (event) => {
        event.preventDefault();
        
        const response = await fetch('/api/transactions/create/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                transaction: {
                    quantity: this.state.quantity, 
                    categoryId: this.state.category,
                    userId: this.state.userId
                }})
        });
        const data = await response.json();
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
            <div id="homeRoot" className="dark-background mt-2">
                {this.state.toSignup ? 
                (<Redirect to={{
                    pathname: '/'
                }}/>)
                :
                (<div></div>)
                }
                <Link to={{
                    pathname: '/categories',
                    state: {userId: this.state.userId}
                }}>
                    <Button color="info" className="ml-2">
                        Categories
                    </Button>
                </Link>
                <Form inline className="mb-4 mt-4 ml-2" onSubmit={this.onSubmit}>
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
                        <Button color="primary" className="ml-1">Add</Button>
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