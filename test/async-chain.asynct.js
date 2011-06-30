var it = require('it-is')
  , Chain = require('async-chain')
  
function newTopic(sync){
return new Chain ({
    hello: function (name, cb){
      var str = 'hello, ' + name
      //console.log(str)
      if(sync) cb(null,str)
      else process.nextTick(function (){cb(null,str)})
    },
    byebye: function (name, cb){
      var str = 'byebye, ' + name
      //console.log(str)
      cb(null,str)
    },
  })
}


exports ['async-chain adds all async methods as properties'] = function (test){
  var topic = newTopic()
  it(topic).has({hello: it.function()})
  test.done()
}


exports ['async-chain throws if you do not call with correct number of arguments'] = function (test){
  var topic = newTopic()
  it(function (){
  topic.hello()
  }).throws()
  test.done()
}
//*/
exports ['accepts optional callback'] = function (test){
  var topic = newTopic()
  topic.hello('miles',function (err,val){
    //console.log(arguments)
    it(err).equal(null)
    it(val).equal('hello, miles')
    test.done()
  })
}

exports ['chaining'] = function (test){
  var topic = newTopic()

  it(topic.hello('jim')).equal(topic)
  it(topic.byebye('andy')).equal(topic)
  test.done()
}

exports ['emit events'] = function (test){
  var topic = newTopic()
  var hi, bye
  topic.on('change',function (event, data){
  
    console.log({EVENT: event, DATA: data})
    
    })
  topic.on('hello', function (){ hi = true })
  topic.on('byebye', function (){ 
    it(hi).ok()
    test.done()
  })
 
  //console.log(topic)

  topic.hello('jim').byebye('andy')
}

exports ['emit events with on drain'] = function (test){
  var topic = newTopic()
  var hi, bye

  topic.on('hello', function (){ hi = true })
  topic.on('byebye', function (){ bye = true })
  topic.on('drain', function (){
    //console.log("DRAINED!!!!")
    it(hi).ok()
    it(bye).ok()
    test.done()
  })
 
  //console.log(topic)

  topic.hello('jim').byebye('andy')
}

exports ['emit events with done'] = function (test){
  var topic = newTopic()
  var hi, bye

  topic.on('hello', function (){ hi = true })
  topic.on('byebye', function (){ bye = true })
  //console.log(topic)

  topic.hello('jim').byebye('andy').done(function (){
    //console.log("DRAINED!!!!")
    it(hi).ok()
    it(bye).ok()
    test.done()
  })
}
