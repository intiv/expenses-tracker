import React, { Component } from 'react';
import { Table, ButtonGroup, Button } from 'reactstrap';

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

    render () {
        return (
            <div id="categoriesRoot">
                <form onSubmit={this.onSubmit}>
                    <div className="row">
                        <h2>Add category</h2>
                    </div>
                    <div className="row">
                        <input type="text" id="categoryName" placeholder="New category name" value={this.state.name} onChange={(event) => { this.setState({name: event.target.value}) }}/>
                    </div>
                    <div className="row">
                        <ButtonGroup>
                            <Button color="success" onClick={this.setState({type: 'Income'})}>Income</Button>
                            <Button color="danger" onClick={this.setState({type: 'Expense'})}>Expense</Button>
                        </ButtonGroup>
                    </div>
                    <div className="row">
                        <Button color="primary">Add</Button>
                    </div>
                </form>
                <h2>Caegories</h2>
                <Table dark striped>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Created at</th>
                            <th scope="col">Updated at</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.categories.map((category, index) => (
                            <tr key={index}>
                                <td>{ category.id }</td>
                                <td>{ category.name }</td>
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