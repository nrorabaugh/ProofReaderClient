import React, { Component } from 'react'
import Axios from 'axios'

export default class Calculation extends Component {
    state = {
        comment: null,
        expression: null,
        editForm: false,
        null: false
    }

    componentDidMount() {
        Axios.get(`/calculations/${this.props.id}`)
        .then((res) => {
            this.setState({comment: res.data[0].comment, expression: res.data[0].expression})
        })
    }

    editForm = () => {
        let toggle = !this.state.editForm
        this.setState({editForm: toggle})
    }

    update = (evt) => {
        evt.preventDefault()
        let calc = {
            comment: evt.target.comment.value,
            expression: evt.target.expression.value,
            id: this.props.id
        }
        this.setState({comment: evt.target.comment.value, expression: evt.target.expression.value, editForm: false})
        Axios.put('/calculations', calc)
    }

    delete = () => {
        this.setState({null: true})
        Axios.delete(`/calculations/${this.props.id}`)
    }

    render() {
        return (
            <div>
            {this.state.null? null : 
            <div className='calculation'>
                <div>
                <strong className='calcContent'>{this.state.expression}</strong>
                <p className='calcContent'><em className='calcContent'>{this.state.comment}</em></p>
                <button onClick={this.editForm}>{this.state.editForm? 'Cancel' : 'Edit'}</button>
                <button onClick={this.delete}>Delete</button>
                {this.state.editForm? <form onSubmit={this.update}>
                    <input type='text' name='expression' defaultValue={this.state.expression} autoComplete='off'></input>
                    <input type='text' name='comment' defaultValue={this.state.comment} autoComplete='off'></input>
                    <input type='submit' value='Change Calculation'></input>
                </form> : null}</div>
            </div>
            }
            </div>
        )
    }
}
