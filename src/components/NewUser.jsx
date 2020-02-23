import React, { Component } from 'react'
import Axios from 'axios'
import { Redirect } from 'react-router-dom'

export default class NewUser extends Component {

    state = {
        status: null,
        class: {},
        user: {},
        exClass: {},
        joined: false
    }

    setStatus = (evt) => {
        this.setState({status: evt.target.id})
    }

    findClass = (evt) => {
        evt.preventDefault()
        Axios.get(`/classrooms/${evt.target.classId.value}`)
        .then((res) => {
            this.setState({exClass: res.data[0], status: "studentJoin"})
        })
    }

    createTeacher = async (evt) => {
        evt.preventDefault()
        let teacher = {
            username: evt.target.username.value,
            password: evt.target.password.value,
            classId: 0,
            role: "teacher"
        }
        Axios.get(`/users/extant/${teacher.username}`)
        .then((res) => {
            if(res.data[0] !== undefined) {
                alert("Username taken")
            }
            if(res.data[0] === undefined) {
                Axios.post('/users', teacher)
                this.setState({user: teacher, status: 'class'})
            }
        })
    }

    createStudent = (evt) => {
        evt.preventDefault()
        let student = {
            username: evt.target.username.value,
            password: evt.target.password.value,
            classId: this.state.exClass.id,
            role: "student"
        }
        Axios.post('/users', student)
        setTimeout(() => {
            Axios.get(`/users/username:${student.username}/password:${student.password}`)
            .then((res) => {
                localStorage.setItem("loggedInUser", JSON.stringify(res.data[0]))
                this.setState({user: res.data[0], joined: true})
            })
        }, 200)
    }

    createClass = (evt) => {
        evt.preventDefault()
        let thisClass = {
            name: evt.target.className.value,
            teacherId: null
        }
        evt.preventDefault()
        Axios.get(`/users/username:${this.state.user.username}/password:${this.state.user.password}`)
        .then((res) => {
            localStorage.setItem('loggedInUser', JSON.stringify(res.data[0]))
            this.setState({user: res.data[0]})
            thisClass.teacherId = res.data[0].id
            Axios.post('/classrooms', thisClass)
        })
        setTimeout( () => {
            Axios.get(`/classrooms/teacher/${thisClass.teacherId}`)
            .then((res) => {
                this.setState({class: res.data[0]})
            })
        }, 200)
    }

    render() {
        let href = null
        if(this.state.class.id) {
            href=`/admin/class/${this.state.class.id}`
        }
        let studentHref = null
        if(this.state.exClass.id) {
            studentHref=`/class/${this.state.exClass.id}`
        }
        return (
            <div>
                {this.state.status === null? 
                <div><div className='banner'><h1>What are you?</h1></div>
                    <button id="teacher" onClick={this.setStatus}>Teacher</button>
                    <button id="student" onClick={this.setStatus}>Student</button>
                </div> : null}
                {this.state.status === 'teacher'?
                <div>
                    <div className='banner'><h1>Choose your Credentials</h1></div>
                    <form className='vertForm' onSubmit={this.createTeacher}>
                        <input type='text' name='username' placeholder='Username'></input>
                        <input type='password' name='password' placeholder='Password'></input>
                        <input type='submit' value='Sign Up'></input>
                    </form> </div>: null}
                {this.state.status === 'class'?
                <div><div className='banner'><h1>Create your Class</h1></div>
                    <form className='vertForm' onSubmit={this.createClass}>
                        <input type='text' name='className' placeholder='Your Class Name'></input>
                        <input type='submit' value='Create Class'/>
                    </form> </div>: null}
                {this.state.class.id === undefined? null : <Redirect to={href}></Redirect> }
                {this.state.joined? <Redirect to={studentHref}></Redirect> : null}
                {this.state.status === 'student'? <div>
                    <div className='banner'><h1>Find your Class</h1></div>
                    <form className='vertForm'onSubmit={this.findClass}>
                        <input type='text' name='classId' placeholder='Your Class ID'></input>
                        <input type='submit' value='Find Class'></input>
                    </form>
                </div> : null}
                {this.state.status === 'studentJoin'? <div>
                    <div className='banner'><h1>{this.state.exClass.name}</h1><h1>Choose your Credentials</h1></div>
                    <form className='vertForm' onSubmit={this.createStudent}>
                        <input type='text' name='username' placeholder='Username'></input>
                        <input type='password' name='password' placeholder='Password'></input>
                        <input type='submit' value='Create Account'></input>
                    </form>
                </div> : null}
                <button onClick={() => {
                    console.log(this.state);
                }}></button>
            </div>
        )
    }
}
