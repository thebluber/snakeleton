/**
 *Timer component to trigger timerTick event every 200 ms
 *
 *
 *
 * */

    var EVERY_SECONDS = 100;
    Crafty.c('Timer', { 
        f            : EVERY_SECONDS
      , STOP         : true
      , name         : ''
   
      , init: function(name){
          if (typeof name === 'undefined'){
            this.name =  'timer_'+ new Date();
          }else{
            this.name = name;
          }
          return this;
        }  
      , updateClock: function(){
          Crafty.trigger("timerTick",this);
          if (!this.STOP){
            var self = this;
            Crafty.e("Delay").delay(function(){self.updateClock();},this.f);
          } 
        }  
      , setFrequency: function(f){
          if ( typeof f !== 'undefined'){
            this.f = f;
          }
          return this;
        }
      , stop: function(){
          this.STOP = true;
          return this;
        }
      , resume: function(){
          this.STOP = false;
          this.updateClock();
          return this;
        }
      , timeUp: function(){
          if (this.duration <= 0){
            this.duration = DURATION;
            return true;
          } else {
            this.duration -= 1;
            return false;
          }
        } 
  
   });

/******
 *
 *
 *
*/
