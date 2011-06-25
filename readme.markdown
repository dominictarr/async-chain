# construct async chains.

var ch = new Chains({
  //object of async functions
  method1: function (arg1,arg2, callback) {},
  method2: function (arg1,arg2, callback) {}
})

then call ch.method1 like this

ch.method1(1,2).method2(3,4)
ch.once('drain', function (){
  called when all the commands are done.
})

ch is an event emitter. it will emit the callback args of every async called.


#conventions

async-chains depends on some strict conventions.

    * arguments must be literal - no varible arguments.
    * callback must be last.