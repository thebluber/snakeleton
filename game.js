  //generate a random color  
    var randColor = function(){
      return 'rgb(' + Crafty.math.randomInt(10, 255) + ',' + Crafty.math.randomInt(100, 255) + ',' + Crafty.math.randomInt(10, 255) + ')';
    }
window.onload = function(){
    BLOCKSIZE = 20;
    WIDTH = 24 * BLOCKSIZE;
    HEIGHT = 18 * BLOCKSIZE;
  //init Crafty
    Crafty.init(WIDTH, HEIGHT);
  
    //move the snake
      var move = function(snake){
        var head = snake.blocks[0];
        head.moveTo();
        for (var i = 1; i < snake.blocks.length; i++){
          snake.blocks[i].moveTo();
          snake.blocks[i].next_dir = snake.blocks[i-1].current_dir;
        };
        return snake;
      }

    //change pictures
    var changePic = function(snake){
      for(var i = 0; i < snake.blocks.length; i++){
        var pic = snake.blocks[i].pic.match(/[^0-9]+/)[0];
        var dir = snake.blocks[i].current_dir;
        switch(dir){
          case "n":
          snake.blocks[i].changePic(pic + 1);
          break;
          case "e":
          snake.blocks[i].changePic(pic + 2);
          break;
          case "s":
          snake.blocks[i].changePic(pic + 3);
          break;
          case "w":
          snake.blocks[i].changePic(pic + 4);
          break;
           
        }   
      }  
    }

    //Initialize Timer
      var Timer = Crafty.e("Timer").resume(); 
    //loading
      Crafty.scene("loading", function(){
        Crafty.load(["img/snakeleton.png"], function() {
          load("START");
        });
        Crafty.background("#000");
        Crafty.e("2D, DOM, Text").attr({ w: 100, h: 20, x: 150, y: 120 })
              .text("Loading")
              .css({ "text-align": "center" });
    
      });    

    //sprite map
    Crafty.sprite(BLOCKSIZE, "img/snakeleton.png", {
      head1: [0, 0],
      head2: [1, 2],
      head3: [2, 1],
      head4: [2, 2],
      neckleft1: [1, 1],
      neckleft2: [0, 3],
      neckleft3: [3, 0],
      neckleft4: [3, 3],
      neckright1: [0, 1],
      neckright2: [0, 2],
      neckright3: [2, 0],
      neckright4: [3, 2],
      bodyleft1: [0, 4],
      bodyleft2: [3, 4],
      bodyleft3: [1, 5],
      bodyleft4: [2, 5],
      bodyright1: [0, 5],
      bodyright2: [2, 4],
      bodyright3: [1, 4],
      bodyright4: [3, 5],
      curveWN: [0, 7],
      curveNW: [2, 8],
      curveSE: [0, 8],
      curveES: [2, 7],
      curveSW: [1, 8],
      curveWS: [3, 7],
      curveEN: [1, 7],
      curveNE: [3, 8],
      tailleft1: [1, 6],
      tailleft2: [2, 6],
      tailleft3: [1, 9],
      tailleft4: [3, 6],
      tailright1: [0, 6],
      tailright2: [3, 9],
      tailright3: [0, 9],
      tailright4: [2, 9]
    })

    //init start or restart scene
      var load = function(text){
    //define start scene
        Crafty.scene("start", function(){
          //loading text
          Crafty.background("black");
          //middlepoint
          var m = {x: WIDTH/2 - 50, y: HEIGHT/2 - 10};
          //set text
          Crafty.e("2D, DOM, Text, Tween").attr({ w: 100, h: 20, x: m.x, y: m.y, fadeOut: "false"})
              .text(text)
              .css({ "text-align": "center", "color": "white"})
              .bind("timerTick", function(){
                if(this.fadeOut){
                  this.tween({alpha: 1.0}, 5);
                  this.fadeOut = false;
                } else {
                  this.tween({alpha: 0.0}, 5);
                  this.fadeOut = true;
                };
              });
          //trigger main scene
          Crafty.e("2D, DOM, Mouse").attr({w: WIDTH, h: HEIGHT, x: 0, y: 0})
              .bind("Click", function(e){
                Crafty.scene("main");
              });

          //background
          var wind = 0;
          var snake = Crafty.e("2D,Canvas")
                            .attr({blocks: [Crafty.e("block").makeBlock(0,BLOCKSIZE,"e","e",randColor())]})
                            .bind('EnterFrame', function(e){
                              var head = this.blocks[0];
                              var last = this.blocks[this.blocks.length - 1];
                              var max = {x: WIDTH, y: HEIGHT};
                              //set direction
                              var setDir = function(){
                                var dirs = ["e", "s", "w", "n"];
                                if (head.next_dir == "e" && head.x == max.x - ((3 + wind) * BLOCKSIZE)){ return head.next_dir = "s";};
                                if (head.next_dir == "s" && head.y == max.y - ((3 + wind) * BLOCKSIZE)){ return head.next_dir = "w";};
                                if (head.next_dir == 'w' && head.x == (2 + wind) * BLOCKSIZE ){wind++;return head.next_dir = "n";};
                                if (head.next_dir == 'n' && head.y == (2 + wind) * BLOCKSIZE ){;return  head.next_dir = "e";};
                              };
                              move(this);
                              setDir();
                              if (this.blocks.length < 80) { //(max.x/BLOCKSIZE) * 2 + (max.y/BLOCKSIZE) * 2) {
                                this.blocks.push(Crafty.e("block").makeBlock(last.x, last.y, "", last.current_dir, randColor()))
                              }; 
                             
                              //reset position
                              if (!last.within(0,0,max.x,max.y)){
                                this.blocks.map(function(b){b.destroy()});
                                this.blocks = [Crafty.e("block").makeBlock(0,BLOCKSIZE,"e","e",randColor())]; 
                                wind = 0;
                              }
                                
                            })
        });
      Crafty.scene("start");
    };

  //main scene
    Crafty.scene("main", function(){
      Crafty.background("black");
      start();
    });

  //start game
    var start = function(){
      //create feed
      var makeFeed = function(){
        var x = Crafty.math.randomInt(BLOCKSIZE, WIDTH - BLOCKSIZE);
        var y = Crafty.math.randomInt(BLOCKSIZE * 2, HEIGHT -BLOCKSIZE );
        var color = randColor();
        return Crafty.e("2D,Canvas,Color,Tween")
                     .attr({x: x, y: y, w: BLOCKSIZE, h: BLOCKSIZE, feedColor: color})
                     .color(color);  
      };
      var feed = makeFeed();
      //Info banner
      var banner = Crafty.e("2D, Canvas, Color")
                         .attr({w:WIDTH + BLOCKSIZE, h:20, x: -10, y: 0})
                         .color('rgb(75,74,74)');
      //Score && lives
      var info = Crafty.e("2D, DOM, Text")
                        .attr({w: WIDTH, h: 10, x: 5, y: 0})
                        .css({"color": "white"});
      //create a snake
      var t1 = Crafty.e("snake").makeBlock(100, 100, "e", "e").changePic("head2");
      var t2 = Crafty.e("snake").makeBlock(100 - BLOCKSIZE, 100, "e", "e").changePic("neckright2");
      var t3 = Crafty.e("snake").makeBlock(100 - BLOCKSIZE * 2, 100, "e", "e").changePic("bodyleft2");
      var t4 = Crafty.e("snake").makeBlock(100 -BLOCKSIZE * 3, 100, "e", "e").changePic("bodyright2");
      var t5 = Crafty.e("snake").makeBlock(100 -BLOCKSIZE * 4, 100, "e", "e").changePic("tailright2");
      var snake = Crafty.e("2D,Canvas")
                  .attr({blocks:[t1,t2,t3,t4,t5], lives: 3})
                  .bind('timerTick', function(e){
                    var head = this.blocks[0];
                    //update info
                    var snakeScore = this.blocks.length - 5 
                    info.text("SCORE:" + snakeScore + "  LIVES:" + this.lives);
                    //is the snake within the boundary(WIDTH, HEIGHT - banner.h)
                    var minBoundary = {x: BLOCKSIZE * -1, y: banner.h + BLOCKSIZE};
                    var maxBoundary = {x: WIDTH, y: HEIGHT};
                    var isWithin = this.blocks.reduce(function(res, e){

                                      return res && e.within(minBoundary.x, minBoundary.y, maxBoundary.x, maxBoundary.y)
                                    });
                    //restart the game
                    var that = this;
                    var restart = function(){
                      that.blocks.map(function(t){
                        t.destroy();
                      });
                      that.destroy();
                      feed.destroy();
                      load("YOUR SCORE:" + snakeScore +"\nRESTART");
                    };                
                    //does the snake bite itself
                    var bite = this.blocks.slice(1).reduce(function(res, t){
                      return res || t.intersect(head.x, head.y, BLOCKSIZE, BLOCKSIZE);  
                    }, false);
                    //does the snake eat a feed
                    var eatFeed = head.intersect(feed.x, feed.y, BLOCKSIZE, BLOCKSIZE);

                    if (isWithin) { 
                      move(this);
                      changePic(this);        
                      if (bite) { this.lives -= 1};
                      if (eatFeed) {
                        var pic = function() {
                                    if (prev.pic.match(/[^0-9]+/)[0] == "bodyleft") {
                                      last.changePic(last.pic.replace("left", "right"));
                                      return prev.pic.replace("left", "right");
                                    } else {
                                      last.changePic(last.pic.replace("right", "left"));
                                      return prev.pic.replace("right", "left");
                                    };
                                  };
                        var addAt = this.blocks.length - 1;
                        var last = this.blocks[this.blocks.length - 1];
                        var prev = this.blocks[addAt - 1];
                        this.blocks.splice(addAt, 0, Crafty.e("snake").makeBlock(prev.x, prev.y, "", prev.current_dir).changePic(pic()));
                        last.next_dir = this.blocks[addAt].current_dir;
                        feed.tween({alpha: 0.0}, 10);
                        feed.destroy();
                        feed = makeFeed();
                        return this;
                      };
                    } else {
                      //create a new snake
                      var t1 = Crafty.e("block").makeBlock(100, 100, "e", "e", randColor()).addComponent("head1");
                      var t2 = Crafty.e("block").makeBlock(100 - BLOCKSIZE, 100, "e", "e", randColor()).addComponent("head2");
                      var t3 = Crafty.e("block").makeBlock(100 - BLOCKSIZE * 2, 100, "e", "e", randColor());
                      var t4 = Crafty.e("block").makeBlock(100 -BLOCKSIZE * 3, 100, "e", "e", randColor());
                      this.lives -= 1;
                      this.blocks.map(function(b){b.destroy()});
                      this.blocks = [t1,t2,t3,t4];
                    }
                    if (this.lives <= 0) {restart();}
                  })
                  .bind('KeyDown', function(e){
                    var head = this.blocks[0];
                    switch(e.keyCode){
                      case Crafty.keys.RIGHT_ARROW:
                        if (head.current_dir != "w"){
                          head.next_dir = "e";
                        }
                      break;
                      case Crafty.keys.LEFT_ARROW:
                        if (head.current_dir != "e"){
                          head.next_dir = "w";
                        }
                      break;
                      case Crafty.keys.UP_ARROW:
                        if (head.current_dir != "s"){
                          head.next_dir = "n";
                        }
                      break;
                      case Crafty.keys.DOWN_ARROW:
                        if (head.current_dir != "n"){
                          head.next_dir = "s";
                        }
                      break;
                      case Crafty.keys.SPACE:
                          if (!Timer.STOP) {
                            Timer.stop();
                          } else {
                            Timer.resume();
                          }
                      break;
                      default:
                        return;
                      break;
                    } 
                  });
    };
    Crafty.scene("main");

//    Crafty.scene("loading");
}
