import React, { Component } from 'react'

export default class HttpData extends Component {
    render() {
        return (
            <div>
                <p>{this.props.id}</p>
                <p>{this.props.name}</p>
                <p>{this.props.description}</p>
                <p>{this.props.classId}</p>
            </div>
        )
    }
}
