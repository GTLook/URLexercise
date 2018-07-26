import React, { Component } from 'react';
import { Col, Row, Button, Icon } from 'react-materialize'
// import {URLhistory, newURL } from './amperityExcercise'

import './css/App.css';

// Note: Can do this in python, Clojure, JS or any other language too!
// You may also decide to create class or object to wrap this - your call!

class newURL{
  constructor(url, back=null, forward=null){
    this.url = url;
    this.back = back;
    this.forward = forward;
  }
}

// creates the history object - use a class, record, or other structure if you want!
// stores at most `max-count` URLs in the history

class URLhistory{
  constructor(max_count){
    this.head = null;
    this.tail = null;
    this.currentNode = null;
    this.length = 0;
    this.max_count = max_count;
  }

// to support “click a link” on the browser

  store_visit(url){
      //create new entry and increment length
      const newEntry = new newURL(url)
      this.length++
      //if not the first node and has no repeat URLs
      if(this.currentNode && this.currentNode.url !== url){
        this.currentNode.forward = newEntry
        newEntry.back = this.currentNode
        this.head = newEntry
        this.currentNode = newEntry
      }
      //if first node in list
      if(!this.currentNode){
        this.head = newEntry
        this.tail = newEntry
        this.currentNode = newEntry
      }
      //if max_count is at max
      if(this.max_count === this.length){
        this.tail = this.tail.forward
        this.tail.back = null
        this.length--
      }
      // console.log('new node created',url)
    return this
  }


// to support “go back” on the browser
  store_back_move(){
    if(this.currentNode.back){
      this.currentNode = this.currentNode.back
      this.length-- //this is not the true length but will keep track of current user location in the LL
    }
    // console.log('back!', this.currentNode.url)
    return this
  }


  // to support “go forward” on the browser
  store_forward_move(){
    if(this.currentNode.forward){
      this.currentNode = this.currentNode.forward
      this.length++ //this is not the true length but will keep track of current user location in the LL
    }
    // console.log('forward!', this.currentNode.url)
    return this
  }


  // Bonus: look up matching URLs by substring
   lookup(substring){
     if(this.length > 1){
       let searchNode = this.head
       const matchArray = []
       while(searchNode.back){
         if(searchNode.url.includes(substring)) matchArray.push(searchNode.url)
         searchNode = searchNode.back
       }
       return matchArray
    }
  }
}


class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      value: this.newHistory ? this.newHistory.currentNode.url : '',
      max_count: 50,
      autoComplete: [],
    }

    //initates the linked list here
    this.newHistory = new URLhistory(this.state.max_count)

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({value: event.target.value})
    this.handleLookup()
  }

  handleSubmit(event) {
    event.preventDefault()
    this.newHistory.store_visit(this.state.value)
    this.setState({value: this.newHistory.currentNode.url})
  }

  handeForward(){
    this.newHistory.store_forward_move()
    this.setState({value: this.newHistory.currentNode.url})
  }

  handeBack(){
    this.newHistory.store_back_move()
    this.setState({value: this.newHistory.currentNode.url})
  }

  handleLookup(){
    if(this.newHistory.lookup(this.state.value)){
      this.setState({autoComplete: this.newHistory.lookup(this.state.value)})
    }
  }

  handleAutocompleClick(url){
      this.setState({value: url,
                     autoComplete: []})
  }


  render() {
    return (
      <Row>
        <Col>
          <Button
            disabled={this.newHistory.currentNode ? (!this.newHistory.currentNode.back) : true}
            onClick={() => this.handeBack()}
            waves='light'><Icon left>arrow_back</Icon>
          </Button>
          <Button
            disabled={this.newHistory.currentNode ? (!this.newHistory.currentNode.forward) : true}
            onClick={() => this.handeForward()}
            waves='light'><Icon left>arrow_forward</Icon>
          </Button>
        </Col>
        <Col s={8} m={8} l={8} xl={8}>
          <form onSubmit={this.handleSubmit}>
            <Col >
              <label>
                <input type="text" value={this.state.value} onChange={this.handleChange} />
              </label>
              {
                !(this.state.autoComplete.length > 1) ? (null) : this.state.autoComplete.map(url => {
                  return <p onClick={() => this.handleAutocompleClick(url)} >{url}</p>
                })
              }
            </Col>
            <Col>
              <Button waves='light'>Submit</Button>
            </Col>
          </form>
        </Col>
      </Row>
    )
  }
}

export default App;
