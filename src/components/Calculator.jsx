import React, { Component } from 'react'

export default class Calculator extends Component {

    evaluate = (evt) => {
        evt.preventDefault()
        if(evt.target.expression.value !== undefined) {
            //eslint-disable-next-line
            evt.target.expression.value = eval(evt.target.expression.value)
        }
    }

    colorFromKeys(evt) {
        if(document.getElementById(evt.key)){
            let button = document.getElementById(evt.key)
            button.style.backgroundColor = 'red'
        }
    }

    reset(evt) {
        if(document.getElementById(evt.key)){
            let button = document.getElementById(evt.key)
            button.style.backgroundColor = null
        }
    }

    render() {
        return (
            <div>
                <form onSubmit={this.evaluate}>
                    <input id='calcInput' type='text' onKeyDown={this.colorFromKeys} onKeyUp={this.reset} name='expression' autoComplete='off'></input>
                    <input type='submit' value='='/>
                </form>  
                <button id='1'>1</button>
                <button id='2'>2</button>
                <button id='3'>3</button>
                <button id='4'>4</button>
                <button id='5'>5</button>
                <button id='6'>6</button>
                <button id='7'>7</button>
                <button id='8'>8</button>
                <button id='9'>9</button>
                <button id='0'>0</button>
                <button id='-'>-</button>
                <button id='+'>+</button>
                <button id='/'>/</button>
                <button id='*'>*</button>
                <button id='C'>C</button>
                <button id='^'>^</button>
            </div>
        )
    }
}
