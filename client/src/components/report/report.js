import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { BarChart, PieChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { Button } from 'reactstrap';
import './report.css';

export default class Report extends Component {

    state = {
        userId: 0,
        transactions: [],
        categories: {},
        toSignup: false,
        toHome: false,
        incomeData: [],
        expenseData: []
    }

    componentDidMount = async () => {
        if(this.props.location.state){
            await this.setState({
                userId: this.props.location.state.userId,
                transactions: this.props.location.state.transactions,
                categories: this.props.location.state.categories
            });
            this.setData();
        }else{
            await this.setState({toSignup: true});
        }
    }

    setData = () => {
        let incomeData = [];
        let expenseData = [];
        let incomeSets = {};
        let expenseSets = {};
        let categories = this.state.categories;
        if(this.state.transactions.length > 0 && Object.keys(categories).length > 0) {
            this.state.transactions.forEach((transaction) => {
                if(categories[transaction.categoryId].type === 'Income'){
                    if(incomeSets[categories[transaction.categoryId].name]){
                        incomeSets[categories[transaction.categoryId].name].Total += parseFloat(transaction.quantity);
                    }else{
                        incomeSets[categories[transaction.categoryId].name] = {
                            name: categories[transaction.categoryId].name,
                            Total: parseFloat(transaction.quantity)
                        }
                    }
                }else{
                    if(expenseSets[categories[transaction.categoryId].name]){
                        expenseSets[categories[transaction.categoryId].name].Total += parseFloat(transaction.quantity);
                    }else{
                        expenseSets[categories[transaction.categoryId].name] = {
                            name: categories[transaction.categoryId].name,
                            Total: parseFloat(transaction.quantity)
                        }
                    }
                }
            });
            Object.keys(incomeSets).forEach((income) => {
                incomeData.push(incomeSets[income]);
            });
            Object.keys(expenseSets).forEach((expense) => {
                expenseData.push(expenseSets[expense]);
            });
            this.setState({incomeData, expenseData});
        }
        this.setState({incomeData, expenseData});
    }

    render () {
        return (
            <div id="reportRoot" className="light-background pt-2">
                {this.state.toSignup ?
                    (<Redirect to={{
                        pathname: '/',
                        state: {
                            invalid: true
                        }
                    }}/>)
                    :
                    null
                }
                {this.state.toHome ? 
                    (<Redirect to={{
                        pathname: '/home',
                        state: {
                            userId: this.state.userId
                        }
                    }}/>)
                    :
                    null
                }
                
                <div className="row">
                    <div className="col-md-1">
                        <Link to={{
                            pathname: '/home',
                            state: {
                                userId: this.state.userId
                            }
                        }}>
                            <Button color="primary">Home</Button>
                        </Link>
                    </div>
                    <div id="reportContainer" className="col-md-10">
                        <div className="row">
                            <div className="col-md-12">
                                <BarChart width={Object.keys(this.state.categories).length*25} height={350} data={this.state.incomeData}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Bar dataKey="Total" fill="#1DAD3C"/>
                                </BarChart>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <BarChart width={Object.keys(this.state.categories).length*50} height={350} data={this.state.expenseData}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Bar dataKey="Total" fill="#ad2628"/>
                                </BarChart>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}