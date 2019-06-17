import React, { Component } from 'react';
import moment from 'moment';
import { Redirect } from 'react-router-dom';
import { Navbar, Nav, NavbarBrand, NavItem, Form, FormGroup, Button, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardHeader, CardBody } from 'reactstrap';
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
            toast.error(`Error obtaining your categories: ${data.errorMessage}`);
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
            this.calculateBudget();
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
                                                    color: '#181A1B',
                                                    'borderBottom': '1px solid black'
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
                
                <Navbar color="faded" className="nav-bar" light>
                    <NavbarBrand>Expenses Tracker</NavbarBrand>
                    <Nav className="ml-auto" navbar horizontal="true">
                        <div className="row">
                            <div className="col-md-4 pt-2">
                                <NavItem>
                                    Budget: {this.state.budget}
                                </NavItem>
                            </div>
                            <div className="col-md-4">
                                <NavItem>
                                    <Button color="info" className="btn-circle" onClick={() => {this.setState({addCategory: true, addTransaction: false, showModal: true})}}>+Category</Button>
                                </NavItem>
                            </div>
                            <div className="col-md-4">
                                <NavItem>
                                    <Button color="info" className="btn-circle" onClick={() => {this.setState({addCategory: false, addTransaction: true, showModal: true})}}>+Transaction</Button>
                                </NavItem>
                            </div>
                            
                            
                        </div>
                        
                    </Nav>
                </Navbar>
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
                        
                    </div>
                    <div className="col-md-2 col-sm-4">
                        
                    </div>
                    <div className={this.state.budget > 0 ? 'income' : 'expense'}>
                        
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
                <div className="table-scroll">
                    {this.state.transactions.length > 0 ? null : (<div>There seems to be nothing here, add some transactions!</div>)}
                    {this.state.transactions.map((transaction, index) => {
                        return this.state.categories[transaction.categoryId] ? 
                        (<div className={`row ${this.state.categories[transaction.categoryId].type}-container`} key={index}>
                            <div className='col-md-4 offset-md-4 mb-1 mt-1'>
                                <Card className={`${this.state.categories[transaction.categoryId].type}-slide`}>
                                    <CardHeader className={`${this.state.categories[transaction.categoryId].type}-border ${this.state.categories[transaction.categoryId].type}-header`}>
                                        <div className="row">
                                            <div className="col-md-10 card-title">
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
                                    <CardBody className="light-dark-background card-body">{transaction.quantity}</CardBody>
                                </Card>
                            </div>
                        </div>) 
                        :
                        null
                    })}
                </div>
                {/* <Table responsive dark striped hover className="table-header table-font">
                    <thead>
                        <tr>
                            <th scope="col" width="14%">Type</th>
                            <th scope="col" width="29%">Category</th>
                            <th scope="col" width="21%">Quantity</th>
                            <th scope="col" width="22%">Date</th>
                            <th scope="col" >Delete</th>
                        </tr>
                    </thead>
                </Table>
                <div className="table-scroll">
                    <Table responsive dark striped hover>
                        <tbody>
                            {this.state.transactions.map((transaction, index) => 
                                
                                {return this.state.categories[transaction.categoryId] ?
                                    (<tr key={transaction.id}>
                                        <td width="15%" className={this.state.categories[transaction.categoryId].type==='Expense'?
                                            'expense' : 'income'}>{this.state.categories[transaction.categoryId].type}</td>                
                                        <td width="30%" className="table-font">{this.state.categories[transaction.categoryId].name}</td>
                                        <td with="20%" className={this.state.categories[transaction.categoryId].type==='Expense'?
                                            'expense' : 'income'}>{transaction.quantity}</td>
                                        <td className="table-font">{transaction.createdAt}</td>
                                        <td><Button className="btn btn-circle" color="danger" onClick={this.deleteTransaction.bind(this, transaction)}>X</Button></td>
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
                </div> */}
                <ToastContainer/>
            </div>
        );
    }
}