import React, { Component } from 'react';
import { Table } from 'reactstrap';

class Categories extends Component {
    state = {
        categories: [],
        name: ''
    }

    componentDidMount () {
        fetch('/api/categories')
            .then((res) => res.json())
            .then((categories) => {
                console.log('Categories:', categories, 'asdad');
                this.setState({categories});
            });
    }

    onSubmit = (event) => {
        event.preventDefault();
        fetch(`/api/categories/create/${this.state.name}`, {method: 'post'})
            .then((res) => res.json())
            .then((categories) => {
                this.setState({categories});
            });
    }

    render () {
        return (
            <div id="categoriesRoot">
                <form onSumbit={this.onSubmit}>
                    <h2>Add category</h2>
                    <input type="text" id="categoryName" placeholder="New category name" onChange={(event) => { this.setState({name: event.target.value}) }}/>
                    <button type="submit"></button>
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