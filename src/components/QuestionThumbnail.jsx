import React, { Component } from 'react'
import Axios from 'axios'

export default class QuestionThumbnail extends Component {
    state = {
        question: {
            number: this.props.number,
            content: this.props.content,
            solution: this.props.solution
        },
        update: false
    }

    update = () => {
        let update = !this.state.update
        this.setState({update})
    }

    updateQuestion = (evt) => {
        evt.preventDefault()
        let question = {
            number: evt.target.number.value,
            content: evt.target.content.value,
            solution: evt.target.solution.value,
            id: this.props.id,
            assignmentId: this.props.assignmentId
        }
        Axios.put('/questions', question)
        this.setState({question})
    }

    render() {
        let role = JSON.parse(localStorage.getItem("loggedInUser")).role
        return (
            <div className='question'>
                <h1>#{this.state.question.number}</h1>
                <p>{this.state.question.content}</p>
                <p>Answer: {this.state.question.solution}</p>
                {role === 'teacher'? <button onClick={this.update}>{this.state.update? "Cancel" : "Edit Question"}</button> : null}
                {this.state.update? <form className='vertForm' onSubmit={this.updateQuestion}>
                    <input type='text' name='number' defaultValue={this.props.number}></input>
                    <textarea type='text' name='content' defaultValue={this.props.content}></textarea>
                    <input type='text' name='solution' defaultValue={this.props.solution}></input>
                    <input type='submit' value='Update Question'></input>
                </form> : null }
            </div>
        )
    }
}
