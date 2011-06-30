
var u = require('d-utils')
  , EventEmitter = require('events').EventEmitter
module.exports = Chain 

function Chain (obj) {
  if(!(this instanceof Chain)) return new Chain(obj)
  var self = this
    , pending = []
    , drained = false
    , working = false
    , jobs = []
    function nextJob(){
      if(working) return
      working = true
      if(jobs.length){
        var n = jobs.shift()
        n[1].apply(self, n[2])
      }
    }

  u.merge(this,u.map(obj,function (funx,event){
    if(!funx.length)
      throw new Error('all functions must take callbacks:' + funx + ' did not have any arguments')
    return function (){
      var l = funx.length
        , args = [].slice.call(arguments)
        , callback

      if(l == args.length && args.length && u.isFunction(u.last(args))){
        callback = args.pop()
      }
      else if(l != args.length + 1)
        throw new Error(event + ' takes ' + (l - 1) + ' arguments, got:' + args.length + '(callback is implicit)')
      //
      //emit event when callback is called.
      //

      function done (err){
        var args = [].slice.call(arguments)
          , errors = []
        function tryIt(funx){
          try { funx() } catch (err) {errors.push(err)}
        }
        //catch errors in callbacks, so ensure callbacks are called, and then rethrow.
      
        if(callback) tryIt(function (){ 
          callback.apply(null, args) 
        })
        if(err) tryIt(function (){ 
          self.emit.apply(self,['error'].concat(args)) 
        })
        else tryIt(function (){
          self.emit.apply(self,[event].concat(args))
          self.emit.apply(self,['change',event].concat(args))
        })

        working = false

        if(jobs.length) nextJob()
        else
          process.nextTick(function (){ 
            self.emit('drain') 
          })

        if(errors.length) throw errors.length == 1 ? errors[0] : errors
      }

      pending.push(done)
      args.push(done)

      jobs.push([event, funx, args])

      nextJob()

      return this
    }
  }))
  this.done = function (funx){
    if(pending.length) this.once('drain',funx)
    else funx()
  }
}

Chain.prototype = new EventEmitter()
