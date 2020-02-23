import React, { Component } from 'react'
import Axios from 'axios'
import SolutionThumbnail from './SolutionThumbnail'
import Message from './Message'

export default class TeacherAssignmentView extends Component {

    state = {
        view: 'solutions',
        assignment: {},
        solutions: [],
        questions: [],
        solutionsToShow: [[],[],[]],
        users: [],
        messages: [],
        messagesToShow: [],
        remapIndex: 0
    }

    stsProcess = (arr) => {
        let solutionsToShow = [[],[],[]]
        let o = 0
        for(let i=0; i<arr.length; i++) {
            solutionsToShow[o].push(arr[i])
            if(o === 2) {
                o = 0
            } else {
                o += 1
            }
        }
        this.setState({solutionsToShow})
    }
    
    componentDidMount() {
        let userIds = []
        let users = []
        let { match: { params } } = this.props
        Axios.get(`/solutions/assignment/${params.id}`)
        .then((res) => {
            this.setState({solutions: res.data})
            this.stsProcess(res.data)
            for(let i=0; i<this.state.solutions.length; i++) {
                if(userIds.indexOf(this.state.solutions[i].userId) === -1) {
                    userIds.push(this.state.solutions[i].userId)
                    Axios.get(`/users/${this.state.solutions[i].userId}`)
                    .then((res) => {
                        users.push(res.data[0])
                        let select = document.getElementById('byUser')
                        let option = document.createElement('option')
                        option.setAttribute('value', res.data[0].id.toString())
                        option.innerText = res.data[0].username
                        select.add(option)
                    })
                } 
            }
        })
        Axios.get(`/assignments/${params.id}`)
        .then((res) => {
           this.setState({assignment: res.data[0]})
        })
        Axios.get(`/questions/assignment/${params.id}`)
        .then((res) => {
            this.setState({questions: res.data})
        })
        Axios.get(`/messages/assignment/${params.id}`)
        .then((res) => {
            for(let i=0; i<res.data.length; i++) {
                if(userIds.indexOf(res.data[i].senderId) === -1) {
                    userIds.push(res.data[i].senderId)
                    Axios.get(`/users/${res.data[i].senderId}`)
                    .then((res) => {
                        users.push(res.data[0])
                        let select = document.getElementById('byUser')
                        let option = document.createElement('option')
                        option.setAttribute('value', res.data[0].id.toString())
                        option.innerText = res.data[0].username
                        select.add(option)
                    })
                } 
            }
            this.setState({messages: res.data, messagesToShow: res.data})
        })
        this.setState({users})
    }

    componentDidUpdate() {
        if(this.state.view === 'messages') {
            let select = document.getElementById('byUser')
            if(select.innerText === "All"){
            for(let i = 0; i < this.state.users.length; i++) {
                let option = document.createElement('option')
                option.setAttribute('value', this.state.users[i].id.toString())
                option.innerText = this.state.users[i].username
                select.add(option)
                }            
            }
        }
        if(this.state.view === 'solutions') {
            let select = document.getElementById('byQuestion')
            if(select.innerText === "All"){
                for(let i = 0; i<this.state.questions.length; i++) {
                    let option = document.createElement('option')
                    option.setAttribute('value', this.state.questions[i].id.toString())
                    option.innerText = this.state.questions[i].number
                    select.add(option)
                }
            }
            let selectUser = document.getElementById('byUser')
            if(selectUser.innerText==='All'){
                for(let i = 0; i < this.state.users.length; i++) {
                    let option = document.createElement('option')
                    option.setAttribute('value', this.state.users[i].id.toString())
                    option.innerText = this.state.users[i].username
                    selectUser.add(option)
                }  
            }   
        }
    }

    findByUser = () => {
        let questionQuery = document.getElementById('byQuestion').value
        let userQuery = document.getElementById('byUser').value
        let remapIndex = this.state.remapIndex + 1
        this.setState({remapIndex})
        if(questionQuery === 'all' && userQuery === 'all') {
            let solutions = this.state.solutions
            this.stsProcess(solutions)
        }
        if(questionQuery === 'all' && userQuery !== 'all') {
            let solutionsToShow = []
            for(let i=0; i<this.state.solutions.length; i++) {
                if(this.state.solutions[i].userId === parseInt(userQuery)) {
                    solutionsToShow.push(this.state.solutions[i])
                }
            }
            this.stsProcess(solutionsToShow)
        }
        if(userQuery === 'all' && questionQuery !== 'all' ) {
            let solutionsToShow = []
            for(let i=0; i<this.state.solutions.length; i++) {
                if(this.state.solutions[i].questionId === parseInt(questionQuery)) {
                    solutionsToShow.push(this.state.solutions[i])
                }
            }
            this.stsProcess(solutionsToShow)
        }
        if(userQuery !== 'all' && questionQuery !== 'all' ) {
            let solutionsToShow = []
            for(let i=0; i<this.state.solutions.length; i++) {
                if((this.state.solutions[i].questionId === parseInt(questionQuery))&&(this.state.solutions[i].userId === parseInt(userQuery)) ) {
                    solutionsToShow.push(this.state.solutions[i])
                }
            }
            this.stsProcess(solutionsToShow)
        }
    }

    searchMessages = (evt) => {
        evt.preventDefault()
        let messagesToShow = []
        this.setState({messagesToShow})
        let query = evt.target.messageQuery.value.split(' ')
        for(let i=0; i<this.state.messages.length; i++){
            for(let o=0; o<query.length; o++){
                if(this.state.messages[i].content.includes(query[o]) && messagesToShow.indexOf(this.state.messages[i]) === -1){
                    messagesToShow.push(this.state.messages[i])
                }
            }
        }
        this.setState({messagesToShow})
    }

    findMessagesByUser = () => {
        let remapIndex = this.state.remapIndex + 1
        this.setState({remapIndex})
        let messagesToShow = []
        let userQuery = document.getElementById('byUser').value
        if(userQuery === 'all'){
            this.setState({messagesToShow: this.state.messages})
            return
        }
        for(let i =0; i<this.state.messages.length; i++) {
            if(this.state.messages[i].senderId.toString() === userQuery){
                messagesToShow.push(this.state.messages[i])
            }
        }
        this.setState({messagesToShow})
    }

    switchView = (evt) => {
        this.setState({view: evt.target.id})
    }

    render() {
        let remapIndex = this.state.remapIndex
        let solutionsMap1 = this.state.solutionsToShow[0].map((solution, index) => {
            return <SolutionThumbnail key={index + (this.state.solutions.length*remapIndex)}
            id={solution.id} 
            userId={solution.userId} 
            questionId={solution.questionId}
            />
        })
        let solutionsMap2 = this.state.solutionsToShow[1].map((solution, index) => {
            return <SolutionThumbnail key={index + (this.state.solutions.length*remapIndex)}
            id={solution.id} 
            userId={solution.userId} 
            questionId={solution.questionId}
            />
        })
        let solutionsMap3 = this.state.solutionsToShow[2].map((solution, index) => {
            return <SolutionThumbnail key={index + (this.state.solutions.length*remapIndex)}
            id={solution.id} 
            userId={solution.userId} 
            questionId={solution.questionId}
            />
        })

        let messagesMap = this.state.messagesToShow.map((message, index) => {
            return <Message key={index + (remapIndex*this.state.messages.length)} senderId={message.senderId} content={message.content}/>
        })
        return (
            <div>
                <div className='banner'><h1>{this.state.assignment === undefined? 'New Assignment' : this.state.assignment.name}</h1></div>
                <nav>
                    <button onClick={this.switchView} id='solutions'>Solutions</button>
                    <button onClick={this.switchView} id='messages'>Messages</button>
                </nav>
                {this.state.view === 'solutions'?
                <div><select id='byQuestion' onChange={this.findByUser}>
                    <option value='all'>All</option>
                </select>
                <select id='byUser' onChange={this.findByUser}>
                    <option value='all'>All</option>
                </select>
                <div className='solutionWrap'>
                    <div className='column'>{solutionsMap1}</div>
                    <div className='column'>{solutionsMap2}</div>
                    <div className='column'>{solutionsMap3}</div>
                </div> 
                </div> : null }
                {this.state.view === 'messages'?
                <div>
                <form onSubmit={this.searchMessages}>
                    <input type='text' name='messageQuery' placeholder='Keywords to search'></input>
                    <input type='submit' value='Search'/>
                </form>
                <select id='byUser' onChange={this.findMessagesByUser}>
                    <option value='all'>All</option>
                </select>
                <div>
                    {messagesMap}
                </div>
                </div> : null }
            </div>
        )
    }
}
