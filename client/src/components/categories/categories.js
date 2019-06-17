import React, { Component } from 'react';
import { Table, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Redirect, Link } from 'react-router-dom';

class Categories extends Component {
    state = {
        categories: [],
        name: '',
        type: '',
        userId: 0,
        toSignup: false
    }

    componentDidMount = async () => {
        if(this.props.location.state){
            await this.setState({userId: this.props.location.state.userId});
            await this.getCategories();
        }else{
            this.setState({toSignup: true});
        }
    }

    getCategories = async () => {
        const response = await fetch(`/api/categories?userId=${this.state.userId}`);
        const data = await response.json();
        
        if(!data.errorMessage){
            this.setState({categories: data.categories, errorMessage: ''});
        }else{
            this.setState({categories: {}, errorMessage: data.errorMessage});
        }
    }

    onSubmit = async (event) => {
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
            this.setState({categories: data.categories, errorMessage: '', name: ''});
        }else{
            this.setState({categories: [], errorMessage: data.errorMessage, name: ''});
        }
            
    }

    setType = (type) => {
        this.setState({type});
    }

    render () {
        return (
            <div id="categoriesRoot">
                {this.state.toSignup ?
                (<Redirect to={{
                    pathname: '/'
                }}/>)
                :
                (<div></div>)}
                <div className="row">
                    <div className="col-md-12 mt-2">
                        <Link to={{
                            pathname: '/home',
                            state: {userId: this.state.userId}
                        }}>
                            <Button color="info" className="ml-2">
                                Home
                            </Button>
                        </Link>
                        <Form onSubmit={this.onSubmit}>
                            <div className="row">
                                <div className="ml-2 col-md-10">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h2>Add category</h2>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <Input type="text" id="categoryName" placeholder="New category name" value={this.state.name} onChange={(event) => { this.setState({name: event.target.value}) }}/>
                                        </div>
                                    </div>
                                    
                                    <div className="row">
                                        <div className="col-md-12 col-sm-12">
                                            <FormGroup tag="fieldset">
                                                <legend>This category is a:</legend>
                                                <FormGroup check>
                                                    <Label check>
                                                        <Input type="radio" name="radioType" onClick={() => this.setState({type: 'Income'})}/>
                                                        Income
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check>
                                                    <Label check>
                                                        <Input type="radio" name="radioType" onClick={() => this.setState({type: 'Expense'})}/> 
                                                        Expense
                                                    </Label>
                                                </FormGroup>
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <Button color="primary">Add</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                        <h2>Categories</h2>
                        <Table dark striped hover className="table">
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Created</th>
                                    <th scope="col">Updated</th>
                                </tr>
                            </thead>    
                            <tbody>
                                {this.state.categories.map((category, index) => (
                                    <tr key={index}>
                                        <td>{ category.id }</td>
                                        <td>{ category.name }</td>
                                        <td>{ category.type }</td>
                                        <td>{ category.createdAt }</td>
                                        <td>{ category.updatedAt }</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>    
                </div>
            </div>
        );
    }
}

export default Categories;