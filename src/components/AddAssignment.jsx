import React, { Component } from 'react'
import Axios from 'axios'
import QuestionThumbnail from './QuestionThumbnail'

export default class addAssignment extends Component {
    state = {
        classId: null,
        assignment: {},
        questionForm: false,
        questions: [],
        newQuestion: false,
        remapIndex: 0
    }

    componentDidMount() {
        const { match: { params } } = this.props
        this.setState({classId: params.classId})
    }

    componentDidUpdate = async () => {
        if(this.state.assignment !== undefined && this.state.assignment.id === undefined) {
            Axios.get(`/assignments/name/${this.state.assignment.name}`)
            .then(async (res) => {
                await this.setState({assignment: res.data[0]})
            })
        }
    }
 
    addAssignment = (evt) => {
        evt.preventDefault()
        let assignment = {
            classId: this.state.classId,
            name: evt.target.name.value,
            description: evt.target.description.value
        }
        Axios.post('/assignments', assignment)
        this.setState({assignment})
        setTimeout(() => {
            Axios.get(`/assignments/name/${assignment.name}`)
            .then(async (res) => {
                await this.setState({assignment: res.data[0], questionForm: true})
            })
        }, 200)
    }

    submitQuestion = (evt) => {
        evt.preventDefault()
        let question = {
            number: evt.target.number.value,
            content: evt.target.content.value,
            solution: evt.target.solution.value,
            assignmentId: this.state.assignment.id
        }
        Axios.post('/questions', question)
        setTimeout(() => {
            Axios.get(`/questions/assignment/${this.state.assignment.id}`)
            .then((res) => {
                res.data.sort((a, b) => {
                    return a.number-b.number
                })
                this.setState({questions: res.data})
            })
        }, 300)
    }

    click = () => {
        console.log(this.state)
    }

    render() {
        let remapIndex = this.state.remapIndex
        let questMap = this.state.questions.map((question, index) => {
            return <QuestionThumbnail  key = {index + (remapIndex * this.state.questions.length)} assignmentId={question.assignmentId} id = {question.id} number = {question.number} content = {question.content} solution = {question.solution}/>
        })
        return (
            <div>
                <div className='banner'><h1>{this.state.assignment === undefined? 'New Assignment' : this.state.assignment.name}</h1></div>
                <form className='vertForm'onSubmit={this.addAssignment}>
                    <input type='text' name='name' placeholder='Name'></input>
                    <input type='text' name='description' placeholder='Description'></input>
                    <input type='submit' value='Add Assignment'></input>
                </form>
                {questMap}
                {this.state.questionForm?
                    <form className='vertForm'onSubmit={this.submitQuestion}>
                        <input type='text' name='number' placeholder='Number'></input>
                        <textarea type='text' name='content' placeholder='Prompt'></textarea>
                        <input type='text' name='solution' placeholder='Answer'></input>
                        <input type='submit' value='Add Question'></input>
                    </form> : null}
                <button onClick={this.click}>Console</button>
            </div>
        )
    }
}
