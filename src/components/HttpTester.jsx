import React, { Component } from 'react'
import axios from 'axios'
import HttpData from './HttpData'

export default class HttpTester extends Component {

    state = {
        requestData: []
    }

    componentDidMount() {
        axios.get('/assignments')
        .then((res) => {
            this.setState({requestData: res.data})
        })
    }
    request = (evt) => {
        axios.get(`/${evt.target.id}`)
        .then((res) => {
            this.setState({requestData: res.data})
            console.log(this.state)
        })
    }

    render() {
        let dataRender = this.state.requestData.map((ass, index) => {
            return <HttpData
            key = {index}
            id = {ass.id}
            name = {ass.name}
            description = {ass.description}
            classId = {ass.classId}
            />
        })
        return (
            <div>
                <button id='assignments' onClick={this.request}>Assignments</button>
                <button id='classrooms' onClick={this.request}>Classrooms</button>
                <button id='messages' onClick={this.request}>Messages</button>
                <button id='users' onClick={this.request}>Users</button>
                <button id='questions' onClick={this.request}>Questions</button>
                <button id='calculations' onClick={this.request}>Calculations</button>
                <button id='solutions' onClick={this.request}>Solutions</button>
                <div>
                    {dataRender}
                </div>
            </div>
        )
    }
}
