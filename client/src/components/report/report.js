import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { BarChart, PieChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import './report.css';

export default class Report extends Component {

    state = {
        userId: 0,
        transactions: [],
        categories: {},
        toSignup: false,
        toHome: false,
        data: []
    }

    componentDidMount = async () => {
        if(this.props.location.state){
            await this.setState({
                userId: this.props.location.state.userId,
                transactions: this.props.location.state.transactions,
                categories: this.props.location.state.categories
            });
            await this.setData();
        }else{
            await this.setState({toSignup: true});
        }
    }

    setData = async () => {
        let data = [];
        if(this.state.transactions.length > 0 && Object.keys(this.state.categories).length > 0) {

        }
        await this.setState({data});
    }

    render () {
        return (
            <div id="reportRoot" className="light-background pt-3">
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
                    <div id="reportContainer" className="col-md-6 offset-md-3">
                        asd
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6-offset-3">
                        <BarChart width={730} height={250} data={this.state.data}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name"/>
                            <YAxis/>
                            <Tooltip/>
                            <Legend/>
                            <Bar dataKey="pv" fill="#1DAD3C"/>
                        </BarChart>
                    </div>
                </div>
            </div>
        )
    }

}