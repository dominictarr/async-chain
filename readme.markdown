[![build status](https://secure.travis-ci.org/dominictarr/async-chain.png)](http://travis-ci.org/dominictarr/async-chain)
# construct async chains.

    var ch = new Chains({
      //object of async functions
      method1: function (arg1,arg2, callback) {},
      method2: function (arg1,arg2, callback) {}
    })

then call methods like this:

    ch.method1(1,2).method2(3,4).done(function (){
      called when all the commands are done.
    })

an instance of `Chain` is an event emitter. 
It will emit the callback args of every async called. 
The events are the names of the methods. Also, you can pass callbacks in the usual way.

if a method calls back with an argument in the first slot Chain will emit 'error'

also, an Chains emits a 'change' event, that emits the same arguments as the normal event, 
but with the event name as the first argument.

##conventions

async-chains depends on some strict conventions.

  * no varible arguments. the number of arguments will be asserted.
  * callback must be last.
  * functions may refur to `this`. this will be the `Chain` instance 
