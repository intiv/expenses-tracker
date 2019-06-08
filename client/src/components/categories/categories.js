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
                console.log(categories);
                this.setState({ ...this.state, categories})
            });
    }

    renderRows () {
        this.state.categories.map((category, index) => (
            <tr key={index}>
                <td>{ category.id }</td>
                <td>{ category.name }</td>
            </tr>
        ));
    }

    render () {
        return (
            <div id="categoriesRoot">
                <Table dark>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderRows()}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default Categories;