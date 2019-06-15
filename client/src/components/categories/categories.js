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
            // fetch('/api/categories')
            //     .then((res) => res.json())
            //     .then((resData) => {
            //         console.log('resData:', resData);
            //         if(!resData.errorMessage){
            //             this.setState({categories: resData.categories, errorMessage: ''});
            //         }else{
            //             this.setState({categories: [], errorMessage: resData.errorMessage});
            //         }
            //     });
    }

    getCategories = async () => {
        const response = await fetch(`/api/categories?userId=${this.state.userId}`);
        const data = await response.json();
        
        if(!data.errorMessage){
            // let newCategories = {};
            // data.categories.forEach((category) => {
            //     newCategories[category.id - 1] = category;
            // });
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
                <Link to={{
                    pathname: '/home',
                    state: {userId: this.state.userId}
                }}>
                    <Button color="info">
                        Home
                    </Button>
                </Link>
                <Form onSubmit={this.onSubmit}>
                    <div className="row">
                        <div className="col-md-12">
                            <h2>Add category</h2>
                        </div>
                        <div className="col-md-12">
                            <input type="text" id="categoryName" placeholder="New category name" value={this.state.name} onChange={(event) => { this.setState({name: event.target.value}) }}/>
                        </div>
                        
                        <div className="col-md-12">
                            <FormGroup tag="fieldset">
                                <legend>This category is a:</legend>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="radio" name="radioType" onClick={() => this.setState({type: 'Income'})}/>{' '}
                                        Income
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="radio" name="radioType" onClick={() => this.setState({type: 'Expense'})}/>{' '}
                                        Expense
                                    </Label>
                                </FormGroup>
                            </FormGroup>
                        </div>
                        <div className="col-md-12">
                            <Button color="primary">Add</Button>
                            
                        </div>
                    </div>
                </Form>
                <h2>Categories</h2>
                <Table dark striped>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Type</th>
                            <th scope="col">Created at</th>
                            <th scope="col">Updated at</th>
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
        );
    }
}

export default Categories;