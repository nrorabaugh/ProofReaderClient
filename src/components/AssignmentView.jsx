import React, { Component } from 'react'
import Axios from 'axios'
import Question from './Question'
import Message from './Message'
import GraphingCalculator from './GraphingCalculator'
import Calculator from './Calculator'
import Solution from './Solution'
 
export default class AssignmentView extends Component {
   state = {
       solutionButtonState: null,
       viewer: 'question',
       first: true,
       last: false,
       assignment: null,
       questions: [],
       currentQuestion: {},
       messages: []
   }
 
   componentDidMount() {
       let { match: { params } } = this.props
       Axios.get(`/assignments/${params.id}`)
       .then((res) => {
           this.setState({assignment: res.data[0]})
       })
       Axios.get(`/questions/assignment/${params.id}`)
       .then((response) => {
        response.data.sort((a, b) => {
            return a.number-b.number
        })
           this.setState({questions: response.data, currentQuestion: response.data[0]})
       })
       setInterval(()=>{Axios.get(`/messages/assignment/${params.id}`)
       .then((res) => {
           this.setState({messages: res.data})
       })}, 200)
       this.getQuestionSolution()
   }
   
   getQuestionSolution = () => {
    let id = JSON.parse(localStorage.getItem("loggedInUser")).id
    Axios.get(`/solutions/student/${id}`)
    .then((res) => {
        if(this.state.currentQuestion !== undefined){
            for(let i=0; i<res.data.length; i++){
                if(res.data[i].questionId === this.state.currentQuestion.id) {
                    this.setState({solutionButtonState: "Edit Your Solution"})
                    return
                }
            }}
        this.setState({solutionButtonState: "Submit a Solution"})
    })
   }
   nextQuestion = () => {
       let currentQuestionIndex = this.state.questions.indexOf(this.state.currentQuestion)
       this.setState({currentQuestion: this.state.questions[(currentQuestionIndex+1)], first: false})
       this.getQuestionSolution()
       this.rangeCheck(currentQuestionIndex+1)
   }

    prevQuestion = () => {
        let currentQuestionIndex = this.state.questions.indexOf(this.state.currentQuestion)
        this.setState({currentQuestion: this.state.questions[(currentQuestionIndex-1)]})
        this.getQuestionSolution()
        this.rangeCheck(currentQuestionIndex-1)
    }

    rangeCheck = (index) => {
        if((index+1) !== this.state.questions.length) {
            this.setState({last: false})
        } 
        if((index+1) === this.state.questions.length) {
            this.setState({last: true})
        }
        if(index !== 0) {
            this.setState({first: false})
        }
        if(index === 0) {
            this.setState({first: true})
        }
    }

   switchView = (evt) => {
       this.setState({viewer: evt.target.id})
   }

   sendMessage = (evt) => {
       evt.preventDefault()
       let userId = (JSON.parse(localStorage.getItem("loggedInUser"))).id
       let assignmentId = this.state.assignment.id
       let message = {
           senderId: userId,
           content: evt.target.messageValue.value,
           assignmentId: assignmentId,
           eq: null
       }
       Axios.post('/messages', message)
       evt.target.messageValue.value = ''
   }

   addSolution = () => {
       this.setState({viewer: 'solution'})
   }

   submitAssignment = () => {
       Axios.get(`/solutions/student/${JSON.parse(localStorage.getItem("loggedInUser")).id}`)
       .then((res) => {
           for(let i=0; i<res.data.length; i++){
                let newSolution = res.data[i]
                newSolution.submitted = true               
                Axios.get(`/questions/${res.data[i].questionId}`)
               .then((response) => {
                if(res.data[i].content === response.data[0].solution){
                    newSolution.correct = true
                }
                Axios.put('/solutions', newSolution)
               })
           }
       })
   }
 
   render() {
       let messagesMap = this.state.messages.map((message, index) =>{
           return <Message key={index} senderId={message.senderId} content={message.content}/>
       })
       return (
           <div>
               <div className='banner'>
                   <h1>{this.state.assignment? this.state.assignment.name : null}</h1>
               </div>
               <div className='assignmentContent'>
                   <div className = 'switch'>
                       {this.state.questions[0] === undefined? <h2>This assignment currently has no questions.</h2> : null}
                       {this.state.questions[0] !== undefined && this.state.viewer === 'question'? <div><Question
                       number={this.state.currentQuestion.number}
                       content={this.state.currentQuestion.content}
                       solution={this.state.currentQuestion.solution}
                       /><div className='position'>
                       {this.state.first? null : <button onClick={this.prevQuestion}>Previous Question</button>}
                       <button id="addSolution" onClick={this.addSolution}>{this.state.solutionButtonState}</button>
                       {this.state.last? <button onClick={this.submitAssignment}>Submit Assignment</button> : <button onClick={this.nextQuestion}>Next Question</button>}
                       </div></div> : null}
                       {this.state.viewer === 'graphing'? <div><GraphingCalculator/>
                       </div> : null}
                       {this.state.viewer === 'solution'? <div><Solution question={this.state.currentQuestion}/>
                       </div> : null}
                       {this.state.viewer === 'calculator'? <div><Calculator/>
                       </div> : null}
                       {this.state.questions[0] !== undefined?
                        <div className='switchButtonBar'>
                            <button id='question' onClick={this.switchView}>Questions</button>
                            <button id='calculator' onClick={this.switchView}>Calculator</button>
                            <button id='graphing' onClick={this.switchView}>Graphing Calculator</button>
                        </div> : null}
                   </div>
                   <div className = 'chat'>
                       {messagesMap}
                       <form id='messageInput' onSubmit={this.sendMessage}>
                           <input id='messageInputBox' type='text' name='messageValue' autoComplete='off' placeholder='Send a message...'/>
                           <input type='submit' value='Send'/>
                       </form>
                   </div>
               </div>
           </div>
       )
   }
}

