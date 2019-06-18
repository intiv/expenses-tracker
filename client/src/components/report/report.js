import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './report.css';

export default class Report extends Component {

    state = {
        userId: 0,
        transactions: [],
        categories: {},
        toSignup: false,
        toHome: false
    }

    componentDidMount = async () => {
        if(this.props.location.state){
            await this.setState({
                userId: this.props.location.state.userId,
                transactions: this.props.location.state.transactions,
                categories: this.props.location.state.categories
            });
            
        }else{
            await this.setState({toSignup: true});
        }
    }

    render () {
        return (
            <div id="reportRoot" className="light-background pt-4">
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

                    </div>
                </div>
            </div>
        )
    }

}