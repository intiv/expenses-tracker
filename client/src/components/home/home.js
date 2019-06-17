import React, { Component } from 'react';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import { Table, Form, FormGroup, Button, Input, Label, Alert, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import './home.css';

export default class Home extends Component{

    state = {
        transactions: [],
        categories: {},
        quantity: 0,
        category: 1,
        errorMessage: '',
        userId: 0,
        toSignup: false,
        budget: 0.00,
        options: [],
        showModal: false,
        addCategory: false,
        addTransaction: false,
        name: '',
        type: 'Expense',
        enableCreate: false
    }

    componentDidMount = async () => {
        if(this.props.location.state){
            await this.setState({userId: this.props.location.state.userId});
            toast.success('Welcome!');
            await this.getMonthTransactions();
            await this.getCategories();
            this.calculateBudget();
            this.categoriesSelect();
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
                newCategories[category.id] = category;
            });
            this.setState({categories: newCategories, name:'', errorMessage: ''});
        }else{
            this.setState({categories: {}, errorMessage: data.errorMessage});
        }
            
    }

    getMonthTransactions = async () => {
        const month = moment().month();
        const response = await fetch(`/api/transactions/monthly?beginDate=${moment().date(1).format('YYYY-MM-DD')}&endDate=${moment().month(month+1).date(1).format('YYYY-MM-DD')}&userId=${this.state.userId}`)
        const data = await response.json();
        if(!data.errorMessage){
            await this.setState({ transactions: data.transactions, errorMessage: '' });
        }else{
            this.setState({ errorMessage: data.errorMessage });
        }
        
    }

    submitTransaction = async (event) => {
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
            await this.setState({quantity: 0, category: 0, errorMessage: ''});
            this.getMonthTransactions();
        }else{
            await this.setState({errorMessage: data.errorMessage, quantity: 0, category: 0});
        }
        this.calculateBudget();
        this.toggleModal();
    } 

    submitCategory = async (event) => {
        event.preventDefault();
        const response = await fetch('/api/categories/create/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category: {
                    name: this.state.name, 
                    type: this.state.type,
                    userId: this.state.userId
                }
            })
        });
        const data = await response.json();
        if(!data.errorMessage){
            await this.getCategories();
            await this.categoriesSelect();
        }else{
            await this.setState(prevState => ({categories: prevState.categories, errorMessage: data.errorMessage, name: '', type: ''}));
        }
        this.toggleModal();
    }

    categoriesSelect = async () => {
        let selectOptions = [];
        if(Object.keys(this.state.categories).length>0){
            Object.keys(this.state.categories).forEach((category) => {
                if(this.state.categories[category].type === this.state.type){
                    selectOptions.push({
                        value: this.state.categories[category].id,
                        label: this.state.categories[category].name
                    });
                }
            });
        }
        await this.setState({options: selectOptions});
    }

    calculateBudget = async () => {
        let budget = 0.00;
        if(this.state.transactions.length>0 && Object.keys(this.state.categories).length > 0){
            this.state.transactions.forEach((transaction) => {
                budget += this.state.categories[transaction.categoryId].type === 'Income' ? parseFloat(transaction.quantity) : -parseFloat(transaction.quantity)
            });
            await this.setState({budget: parseFloat(budget).toFixed(2)});
        }else{
            await this.setState({budget: parseFloat(0.00).toFixed(2)});
        }
    }

    renderForm = () => {
        return (
            <div className="row">
                <div className="col-md-12">
                    <Form className="pb-4 pt-4 pl-2" id="modalForm" onSubmit={this.state.addCategory ? this.submitCategory : this.submitTransaction}>
                        <div className="row">
                            <div className="col-md-12">
                                {this.state.addCategory ? (
                                    <FormGroup className="pr-2">
                                        <Label for="categoryName" className="pr-1">Name</Label>
                                        <Input name="categoryName" type="text"
                                            value={this.state.name}
                                            onChange={(event) => {this.setState({name: event.target.value})}}
                                        />
                                    </FormGroup>
                                ) : (
                                    <FormGroup className="pr-2">
                                        <Label for="transactionQty" className="pr-1">Quantity</Label>
                                        <Input name="transactionQty" type="number" min="0.01" step="0.01" 
                                            value={this.state.quantity}
                                            onChange={(event) => { this.setState({quantity: event.target.value}) }}
                                        />
                                    </FormGroup>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <FormGroup tag="fieldset">
                                    <legend>Represents an: </legend>
                                    <FormGroup check>
                                        <Label check>
                                            <Input type="radio" name="radioType" onChange={async () => { await this.setState({type: 'Income'}); await this.categoriesSelect();}} checked={this.state.type === 'Income'}/>
                                            Income
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check>
                                        <Label check>
                                            <Input type="radio" name="radioType" onChange={async () => { await this.setState({type: 'Expense'}); await this.categoriesSelect();}} checked={this.state.type === 'Expense'}/> 
                                            Expense
                                        </Label>
                                    </FormGroup>
                                </FormGroup>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                {this.state.addCategory ? null : (
                                    <FormGroup>
                                        <Label for="transactionCatId" className="pr-1">Select/Search Category</Label>
                                        <Select 
                                            name="transactionCatId" 
                                            options={this.state.options} 
                                            onChange={(event) => this.setState({category: event.value, enableCreate: true})}   
                                        />
                                    </FormGroup> 
                                )} 
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        )
    }


    printAlert = () => {
        return this.state.errorMessage === '' ?
        null
        :
        (<Alert color="danger">{this.state.errorMessage}</Alert>)
    }

    toggleModal = () => {
        this.categoriesSelect();
        this.setState(prevState => ({
            showModal: !prevState.showModal,
            addCategory: false,
            addTransaction: false,
            enableCreate: false,
            quantity: 0,
            name: ''
        }));
    }

    deleteTransaction = async (transaction) => {
        let answer = window.confirm('Delete transaction?');
        if(answer){
            const response = await fetch('/api/transactions/delete/', {
                method: 'delete',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    transaction
                })
            });
            const data = await response.json();
            if(!data.errorMessage){
                this.setState({transactions: data.transactions});
                toast.success('Transaction deleted succesfully!');
                this.calculateBudget();
            }else{
                toast.error('An error occured, could not delete transaction');
            }
        }
    }

    render () {
        return (
            <div id="homeRoot" className="dark-background pt-2">
                {this.state.toSignup ? 
                    (<Redirect to={{
                        pathname: '/',
                        state: {invalid: true}
                    }}/>)
                    : 
                    null
                }
                <div className="row">
                    <div className="col-md-2 col-sm-4">
                        <Button color="info" onClick={() => {this.setState({addCategory: true, addTransaction: false, showModal: true})}}>Add Category</Button>
                    </div>
                    <div className="col-md-2 col-sm-4">
                        <Button color="info" onClick={() => {this.setState({addCategory: false, addTransaction: true, showModal: true})}}>Add Transaction</Button>
                    </div>
                    <div className={this.state.budget > 0 ? 'income' : 'expense'}>
                        Budget: {this.state.budget}
                    </div>
                </div>
                
                <Modal isOpen={this.state.showModal} toggle={this.toggleModal} className="dark-background">
                    <ModalHeader toggle={this.toggleModal}  className="dark-background">{this.state.addCategory ? 'Add Category' : 'Add Transaction' }</ModalHeader>
                    <ModalBody  className="light-dark-background">
                        {this.renderForm()}
                    </ModalBody>
                    <ModalFooter  className="dark-background">
                        <Button color="primary" form="modalForm" type="submit" disabled={!this.state.addCategory && !this.state.enableCreate}>Accept</Button>
                        <Button color="secondary" onClick={this.toggleModal}>Close</Button>
                    </ModalFooter>
                </Modal>
                
                
                {this.printAlert()}
                <Table responsive dark striped hover className="table-header table-font">
                    <thead>
                        <tr>
                            <th scope="col" width="14%">Type</th>
                            <th scope="col" width="30%">Category</th>
                            <th scope="col" width="20%">Quantity</th>
                            <th scope="col" >Date</th>
                        </tr>
                    </thead>
                </Table>
                <div className="table-scroll">
                    <Table responsive dark striped hover>
                        
                        <tbody>
                            {this.state.transactions.map((transaction, index) => 
                                
                                {return this.state.categories[transaction.categoryId] ?
                                    (<tr key={transaction.id} onClick={this.deleteTransaction.bind(this, transaction)}>
                                        <td width="15%" className={this.state.categories[transaction.categoryId].type==='Expense'?
                                            'expense' : 'income'}>{this.state.categories[transaction.categoryId].type}</td>                
                                        <td width="30%" className="table-font">{this.state.categories[transaction.categoryId].name}</td>
                                        <td className={this.state.categories[transaction.categoryId].type==='Expense'?
                                            'expense' : 'income'}>{transaction.quantity}</td>
                                        <td className="table-font">{transaction.createdAt}</td>
                                    </tr>)
                                    :
                                    (<tr key={index}>
                                        <td>{''}</td>
                                        <td>{''}</td>
                                        <td>{''}</td>
                                        <td>{''}</td>
                                        <td>{''}</td>
                                    </tr>)
                                }

                            )}
                            
                        </tbody>
                    </Table>
                </div>
                <ToastContainer/>
            </div>
        );
    }
}