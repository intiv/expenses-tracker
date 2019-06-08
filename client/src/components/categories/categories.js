import React, { Component } from 'react';
import { Table } from 'reactstrap';

class Categories extends Component {
    state = {
        categories: []
    }

    componentDidMount () {
        fetch('/api/categories')
            .then((res) => res.json())
            .then((categories) => {
                console.log('Categories:', categories, 'asdad');
                this.setState({categories});
            });
    }

    render () {
        return (
            <div id="categoriesRoot">
                
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