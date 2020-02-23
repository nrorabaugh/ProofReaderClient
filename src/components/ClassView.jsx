import React, { Component } from 'react'
import AssignmentThumbnail from './AssignmentThumbnail'
import Axios from 'axios'

export default class Classview extends Component {
    state = {
        classData: null,
        assignments: [],
        assignmentToRedirect: null,
        user: null,
        listening: [],
        percentage: 0,
        grade: false
    }

    componentDidMount() {
        let user = JSON.parse(localStorage.getItem("loggedInUser"))
        this.setState({user})
        Axios.get(`/classrooms/${user.classId}`)
        .then((res) => {
            this.setState({classData: res.data[0]})
            localStorage.setItem("currentClass", res.data)
        })
        Axios.get(`/assignments/class/${user.classId}`)
        .then((res) => {
            this.setState({assignments: res.data})
        })
        Axios.get(`/solutions/student/${user.id}`)
        .then((res) => {
            if(res.data[0] !== undefined){
            this.setState({grade: true})
            let correct = 0
            let total = 0
            for(let i=0; i<res.data.length; i++) {
                if(res.data[i].submitted === true) {
                    total += 1
                }
                if(res.data[i].correct === true) {
                    correct +=1
                }
            }
            let frac = (correct/total) * 100
            document.getElementsByClassName('grade')[0].innerText = `${frac}%`
            document.getElementsByClassName('total')[0].style.width = frac + '%'
        }
        })
    }



    render() {
        let assignmentsMap = this.state.assignments.map((assignment, index) => {
            return <AssignmentThumbnail  key = {index} id = {assignment.id} name = {assignment.name}/>
        })
        return (
            <div>
                <div className='banner'><h1>{this.state.classData? this.state.classData.name : 'Class'}</h1></div>
                <div className='pageWrapper'>
                    <div className='assignmentList'>
                        {assignmentsMap}
                    </div>
                    {this.state.grade? 
                    <div className='scorecard'>
                    <div className='gradehead'>Homework Average: <p className='grade'></p></div>
                        <div className='scorebar'>
                            <div className='correctbar total'></div>
                        </div>
                    </div> : null}
                </div>
            </div>
        )
    }
}