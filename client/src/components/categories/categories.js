import React, { Component } from 'react';
import { Table, Button, FormGroup, Label, Input } from 'reactstrap';

class Categories extends Component {
    state = {
        categories: [],
        name: '',
        type: ''
    }

    componentDidMount () {
        fetch('/api/categories')
            .then((res) => res.json())
            .then((categories) => {
                console.log('Categories:', categories);
                this.setState({categories});
            });
    }

    onSubmit = (event) => {
        event.preventDefault();
        fetch('/api/categories/create/', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({category: {name: this.state.name, type: this.state.type}})
            })
            .then((res) => res.json())
            .then((categories) => {
                console.log(categories);
                this.setState({categories, name: ''});
            });
    }

    setType = (type) => {
        this.setState({type});
    }

    render () {
        return (
            <div id="categoriesRoot">
                <form onSubmit={this.onSubmit}>
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
                </form>
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