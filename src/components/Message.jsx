import React, { Component } from 'react'
import Axios from 'axios'

export default class Message extends Component {
    state = {
        sender: {}
    }
    
    componentDidMount() {
        Axios.get(`/users/${this.props.senderId}`)
        .then((res) => {
            this.setState({sender: res.data[0]})
        })
    }
    render() {
        return (
            <div className='message'>
                <p>{this.state.sender.username}: {this.props.content}</p>
            </div>
        )
    }
}
