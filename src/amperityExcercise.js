//creates the node

class newURL{
  constructor(url, back=null, forward=null){
    this.url = url;
    this.back = back;
    this.forward = forward;
  }
}

// creates the history object
// stores at most `max-count` URLs in the history
// keeps track of the Head, Tail, current node the user looks at, the viewed length, and takes the max_count variable.
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
    return this
  }


// to support “go back” on the browser
  store_back_move(){
    if(this.currentNode.back){
      this.currentNode = this.currentNode.back
      this.length-- //this is not the true length but will keep track of current user location in the LL
    }
    return this
  }


  // to support “go forward” on the browser
  store_forward_move(){
    if(this.currentNode.forward){
      this.currentNode = this.currentNode.forward
      this.length++ //this is not the true length but will keep track of current user location in the LL
    }
    return this
  }


  //Look up matching URLs by substring
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
