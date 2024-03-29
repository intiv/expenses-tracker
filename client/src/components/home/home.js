import React, { Component } from 'react';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import { Navbar, Nav, NavbarBrand, NavItem, Form, FormGroup, Button, CustomInput, Input, InputGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardHeader, CardBody } from 'reactstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './home.css';

export default class Home extends Component{

    state = {
        transactions: [],
        categories: {},
        quantity: 0,
        category: 1,
        createdAt: new Date(),
        errorMessage: '',
        userId: 0,
        toSignup: false,
        invalid: true,
        toReport: false,
        budget: 0.00,
        options: [],
        showModal: false,
        addCategory: false,
        addTransaction: false,
        name: '',
        type: 'Expense',
        enableCreate: false,
        alltime: false,
        showEmpty: true
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
            toast.error(`Error obtaining your categories: ${data.errorMessage}`);
            this.setState({categories: {}, errorMessage: data.errorMessage});
        }
            
    }

    getMonthTransactions = async () => {
        const month = moment().month();
        const response = await fetch(`/api/transactions${this.state.alltime === false ? '/monthly' : ''}?beginDate=${moment().date(1).format('YYYY-MM-DD')}&endDate=${moment().month(month+1).date(1).format('YYYY-MM-DD')}&userId=${this.state.userId}`)
        const data = await response.json();
        if(!data.errorMessage){
            await this.setState({ transactions: data.transactions, errorMessage: '', showEmpty: data.transactions.length === 0 });
            await this.calculateBudget();
        }else{
            toast.error(`Error obtaining your transactions: ${data.errorMessage}`)
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
                    userId: this.state.userId,
                    createdAt: moment(this.state.createdAt).format('YYYY-MM-DD')
                }})
        });
        const data = await response.json();
        if(!data.errorMessage){
            toast.success('Transaction added successfully!')
            await this.setState({quantity: 0, category: 0, errorMessage: ''});
            await this.getMonthTransactions();
            await this.calculateBudget();
        }else{
            toast.error(`An error occured: ${data.errorMessage}`);
            await this.setState({errorMessage: data.errorMessage, quantity: 0, category: 0});
        }
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
            toast.success('Category added successfully!');
            await this.getCategories();
            await this.categoriesSelect();
        }else{
            toast.error(`An error occured: ${data.errorMessage}`);
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
                                {this.state.addCategory ? null
                                :
                                (
                                <FormGroup>
                                    <legend>Date</legend>
                                    <DatePicker className="transaction-date" selected={this.state.createdAt} onChange={(date) => this.setState({createdAt: date})}/>
                                </FormGroup>
                                ) }
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
                                            className="light-background"
                                            styles={{
                                                option: base => ({
                                                    ...base,
                                                    color: '#181A1B'
                                                })
                                              }}
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

    changeTime = async () => {
        await this.setState(prevState => ({
            alltime: !prevState.alltime,
            transactions: [],
            showEmpty: false
        }));
        this.getMonthTransactions();
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
                toast.success('Transaction deleted successfully!');
                this.calculateBudget();
            }else{
                toast.error('An error occured, could not delete transaction');
            }
        }
    }

    render () {
        return (
            <div id="homeRoot" className="light-background">
                <Navbar color="faded" className="nav-bar white-font fade-in" light>
                    <NavbarBrand className="white-font">
                        <div className="row">
                            <div className="col-md-4">
                                Expenses Tracker
                            </div>
                            <div className="col-md-5">
                                <Button id="reportButton" color="info" onClick={() => this.setState({toReport: true})}>Generate {this.state.alltime===true ? 'all time' : 'this month\'s'} report</Button>
                            </div>
                            <div className="col-md-3">
                                <InputGroup size="md">
                                    <CustomInput 
                                        id="alltimeSwitch" 
                                        className="mt-2 time-switch" 
                                        value={this.state.alltime} 
                                        onChange={this.changeTime} 
                                        type="switch" 
                                        label={this.state.alltime === true ? 'All time' : 'Month: '+moment().format('MMMM').toString()}/>
          
                                </InputGroup>
                            </div>
                        </div>
                    </NavbarBrand>
                    <div className="row">
                        <div className="col-md-3 white-font">
                            <div className="row">
                                <div className="col-md-12">
                                    Budget: 
                                </div>
                                <div className="col-md-12">
                                    {this.state.budget}
                                </div>
                            </div>
                            
                        </div>
                        <div className="col-md-9">
                            <Nav className="ml-auto" navbar>
                                <div className="row">
                                    <div className="col-md-4">
                                        <NavItem>
                                            <Button color="info" className="btn-circle" onClick={() => {this.setState({addCategory: false, addTransaction: true, showModal: true})}}>+Transaction</Button>
                                        </NavItem>
                                    </div>
                                    <div className="col-md-4">
                                        <NavItem>
                                            <Button color="info" className="btn-circle" onClick={() => {this.setState({addCategory: true, addTransaction: false, showModal: true})}}>+Category</Button>
                                        </NavItem>
                                    </div>
                                    <div className="col-md-4">
                                        <NavItem>
                                            <Button color="danger" className="btn-circle" onClick={() => this.setState({toSignup: true, invalid: false})}>Logout</Button>
                                        </NavItem>
                                    </div>
                                </div>
                            </Nav>
                        </div>
                    </div>
                    
                </Navbar>
                {this.state.toSignup ? 
                    (<Redirect to={{
                        pathname: '/',
                        state: {
                            invalid: this.state.invalid
                        }
                    }}/>)
                    : 
                    null
                }
                {this.state.toReport && this.state.transactions.length > 0 ?
                    (<Redirect to={{
                        pathname: '/report',
                        state: {
                            userId: this.state.userId,
                            transactions: this.state.transactions,
                            categories: this.state.categories
                        }
                    }}/>)
                    : 
                    null
                }
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
                <div className="table-scroll">
                    {this.state.showEmpty === false ? 
                        null 
                        : 
                        (<div className="row fade-in">
                            <div className="col-md-6 offset-md-3">
                                <h2 className="black-font offset-md-2">There seems to be nothing here</h2>
                                <h3 className="black-font">Add some categories and transactions in the top-right!</h3>
                            </div>
                        </div>)
                    }
                    {this.state.transactions.map((transaction, index) => {
                        return this.state.categories[transaction.categoryId] ? 
                        (<div className={`row ${this.state.categories[transaction.categoryId].type}-container`} key={index}>
                            <div className='col-md-4 offset-md-4 mt-2'>
                                <Card className={`${this.state.categories[transaction.categoryId].type}-slide white-font`}>
                                    <CardHeader className={`${this.state.categories[transaction.categoryId].type}-border ${this.state.categories[transaction.categoryId].type}-header white-font`}>
                                        <div className="row">
                                            <div className="col-md-10 card-title white-font">
                                                {this.state.categories[transaction.categoryId].name} 
                                            </div>
                                            <div className="col-md-1">
                                                <Button className="btn btn-circle btn-delete" onClick={this.deleteTransaction.bind(this, transaction)}>X</Button>
                                            </div>
                                            <div className="col-md-12">
                                                {transaction.createdAt}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardBody className="light-dark-background card-body">{this.state.categories[transaction.categoryId].type}: {transaction.quantity}</CardBody>
                                </Card>
                            </div>
                        </div>) 
                        :
                        null
                    })}
                </div>
                <ToastContainer className="mt-5"/>
            </div>
        );
    }
}