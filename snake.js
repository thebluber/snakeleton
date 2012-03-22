window.onload = function(){
    BLOCKSIZE = 20;
    WIDTH = 44 * BLOCKSIZE;
    HEIGHT = 28 * BLOCKSIZE;
  //init Crafty
    Crafty.init(WIDTH, HEIGHT);
    //loading
      Crafty.scene("loading", function(){
        Crafty.load(["img/achievement.png","img/igel.png","img/sssssnakeleton.png","img/snakeleton.png", "img/kaninchen.png", "img/steak.png", "img/herz.png", "img/herz_sw.png"], function() {
          Crafty.scene("main");
        });
        Crafty.background("#000");
        Crafty.e("2D, DOM, Text").attr({ w: 100, h: 20, x: 150, y: 120 })
              .text("Loading")
              .css({ "text-align": "center", "color": "white"});
         
      });
    
    Crafty.scene("loading");
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
      curveNW: [0, 8],
      curveSE: [2, 8],
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
    //feed
    Crafty.sprite(40, "img/kaninchen.png", {
      rabbit: [0, 0]
    });
    Crafty.sprite(20, "img/steak.png", {
      steak: [0, 0]
    });
    //lives
    Crafty.sprite(20, "img/herz.png", {
      heart: [0, 0]
    });
    Crafty.sprite(20, "img/herz_sw.png", {
      noHeart: [0, 0]
    });
    //hedgehog
    Crafty.sprite(20, "img/igel.png", {
      hedgehog: [0, 0]
    });

  
  //main scene
    Crafty.scene("main", function(){
      Crafty.background("black");
      start();
    });
    var start = function(){
      //Initialize Timer
      var Timer = Crafty.e("Timer").resume(); 
      var GAMEOVER = false;
      //create a snake
      var t1 = Crafty.e("snake").makeBlock(150, 100, "e", "e", "head2").addComponent("head");
      var t2 = Crafty.e("snake").makeBlock(150 - BLOCKSIZE, 100, "e", "e", "neckleft2");
      var t3 = Crafty.e("snake").makeBlock(150 - BLOCKSIZE * 2, 100, "e", "e", "bodyright2");
      var t4 = Crafty.e("snake").makeBlock(150 - BLOCKSIZE * 3, 100, "e", "e", "bodyleft2");
      var t5 = Crafty.e("snake").makeBlock(150 - BLOCKSIZE * 4, 100, "e", "e", "bodyright2");
      var t6 = Crafty.e("snake").makeBlock(150 - BLOCKSIZE * 5, 100, "e", "e", "bodyleft2");
      var t7 = Crafty.e("snake").makeBlock(150 - BLOCKSIZE * 6, 100, "e", "e", "tailleft2");
      //create a infobar for score
      var infoBar = Crafty.e("2D, Canvas, Color, Tween")
                          .attr({x: 0, y: 0, w: WIDTH, h: 30})
                          .tween({alpha: 0.5}, 0)
                          .color('rgb(100, 100, 100)');
      //lives
      var l = Crafty.e("2D, DOM, Text")
                    .attr({x: 5, y: 5, w: 55, h: 20})
                    .text("LIVES: ")
                    .css({"color": "white", "text-align": "center", "font-style": "bold", "font-family": "Comic Sans MS"})
      var l1 = Crafty.e("2D, Canvas, heart")
                     .attr({x: l.x + l.w, y: 5, w: 20, h: 20});
      var l2 = Crafty.e("2D, Canvas, heart")
                     .attr({x: l1.x + l1.w, y: 5, w: 20, h: 20});
      var l3 = Crafty.e("2D, Canvas, heart")
                     .attr({x: l2.x + l2.w, y: 5, w: 20, h: 20});
      var lives = [l1, l2, l3];
      var updateLives = function(snake){
        var diff = lives.length - snake.lives;
        if (diff != 0) {
          lives.slice(snake.lives, lives.length).map(function(l){
            l.removeComponent("heart")
             .addComponent("noHeart");
          });  
        }
      }; 

      var title = Crafty.e("2D, DOM, Text, info")
                    .attr({x: l3.x + l3.w + 5, y: 5, w: 120, h: 20})
                    .text("INVENTORY: ")
                    .css({"color": "white", "text-align": "center", "font-style": "bold", "font-family": "Comic Sans MS"});
                    
      var steakAmount = Crafty.e("2D, DOM, Text")
                              .attr({x: title.x + title.w, y: 5, w: 25, h: 20})
                              .text("0 ")
                              .css({"color": "white", "text-align": "center", "font-style": "bold", "font-family": "Comic Sans MS"});
      var steak = Crafty.e("2D, Canvas, steak")
                        .attr({x: steakAmount.x + steakAmount.w, y: 5, w: 20, h: 20});
      var rabbitAmount = Crafty.e("2D, DOM, Text")
                              .attr({x: steak.x + steak.w, y: 5, w: 25, h: 20})
                              .text("0 ")
                              .css({"color": "white", "text-align": "center", "font-style": "bold", "font-family": "Comic Sans MS"});
      var rabbit = Crafty.e("2D, Canvas, rabbit")
                         .attr({x: rabbitAmount.x + rabbitAmount.w, y: 0, w: 30, h: 30});
      //inventory update
      var inventory = function(item){
        var type     
      };
      var regenerateFeed = function() {
        var feeds = ["rabbit", "steak"];
        var rand = Math.floor(Math.random() * 2);
        var feed = Crafty.e('feed').makeFeed(feeds[rand]);
        var randTime = Math.random() * 500;
        if(GAMEOVER) {
          Crafty("feed").destroy();
        };
        if(!Timer.STOP && !GAMEOVER){
          window.setTimeout(function() {
            feed.fadeOut();
            regenerateFeed();
          }, 5000   + randTime);
        }
      };

      //collision check
      var collide = function(feed, snake){
        var head = snake.blocks[0];
        if (feed.hit("head")) {
          //update score
          snake.inventory[feed.type] += 1;
          steakAmount.text(snake.inventory.steak + " ");
          rabbitAmount.text(snake.inventory.rabbit + " ");
          //disappear
          feed.fadeOut();
          //snake grows
          var lastBody = snake.blocks[snake.blocks.length - 2];
          var newBody = Crafty.e("snake").makeBlock(lastBody.x, lastBody.y, "", lastBody.current_dir, lastBody.pic);
          snake.blocks.splice(snake.blocks.length - 1, 0, newBody);
          //adjust tail
          lastBody = snake.blocks[snake.blocks.length - 2];
          var tail = snake.blocks[snake.blocks.length - 1];
          var pic = tail.pic;
          tail.destroy();
          snake.blocks[snake.blocks.length - 1] = Crafty.e("snake").makeBlock(lastBody.x, lastBody.y, "", lastBody.current_dir, pic);
        } 
    }


      var snake = Crafty.e("2D,Canvas,Collision")
                  .attr({blocks: [t1,t2,t3,t4,t5,t6,t7], lives: 3, inventory: {"rabbit": 0, "steak": 0}})
                  .bind("timerTick", function(e){
                    var that = this;
                    //update lives
                    updateLives(this);
                    var head = this.blocks[0];
                    //move snake
                    head.moveTo();
                    for (var i = 1; i < this.blocks.length; i++){
                      this.blocks[i].moveTo();
                      this.blocks[i].animation();
                      this.blocks[i].next_dir = this.blocks[i-1].current_dir;
                      
                    };
                    //is the snake within the boundary
                    var minBoundary = {x: 0, y: infoBar.h};
                    var maxBoundary = {x: WIDTH, y: HEIGHT};
                    var isWithin = head.within(minBoundary.x, minBoundary.y, maxBoundary.x, maxBoundary.y);
                    //collision check: head and tail
                    var bite = head.hit("snake"); 
                    //game
                    if (this.lives < 0) {
                      this.blocks.map(function(b){b.destroy()});
                      GAMEOVER = true;
                      Crafty("feed").destroy();
                      var background = Crafty.e("2D, DOM, Tween, Image")
                                           .image("img/sssssnakeleton.png")
                                           .attr({x: 0, y: -5, w: WIDTH, h: HEIGHT})
                                           .tween({alpha: 0.5}, 5);
                      var gameOver = Crafty.e("2D, DOM, Text, Tween")
                                           .attr({x: 20, y: 50, w: WIDTH * 0.7, h: HEIGHT, fadeOut: false})
                                           .text("GAME OVER")
                                           .css({"color": "white", "text-align": "left", "font-style": "bold", "font-family": "Impact", "font-size": "900%"})
                                           .bind("timerTick", function(e){
                                              if (this.fadeOut) {
                                                this.tween({alpha: 1.0}, 5);
                                                this.fadeOut = false;
                                              } else {
                                                this.tween({alpha: 0.0}, 5);
                                                this.fadeOut = true;
                                              }
                                           });
                      this.unbind("timerTick");
                    };

                    if (isWithin) {
                      //make some feeds
                      if (Crafty("feed").length == 0 && !GAMEOVER){
                        var randAmount = Crafty.math.randomInt(2, 6);
                        for (var i = 0; i < randAmount; i++){
                          regenerateFeed();
                        };
                      };
                      //collision against feed
                      var feeds = Crafty("feed");
                      for (var i = 0; i < feeds.length; i++){
                        collide(Crafty(feeds[i]), that);
                      };
                      //collision against self
                      if (bite) { this.lives -= 1;}
                    } else {
                      this.lives -= 1;
                      //create a new snake
                      var t1 = Crafty.e("snake").makeBlock(100, 100, "e", "e", "head2").addComponent("head");
                      var t2 = Crafty.e("snake").makeBlock(100 - BLOCKSIZE, 100, "e", "e", "neckleft2");
                      var t3 = Crafty.e("snake").makeBlock(100 - BLOCKSIZE * 2, 100, "e", "e", "bodyright2");
                      var t4 = Crafty.e("snake").makeBlock(100 - BLOCKSIZE * 3, 100, "e", "e", "bodyleft2");
                      var t5 = Crafty.e("snake").makeBlock(100 - BLOCKSIZE * 4, 100, "e", "e", "bodyright2");
                      var t6 = Crafty.e("snake").makeBlock(100 - BLOCKSIZE * 5, 100, "e", "e", "bodyleft2");
                      var t7 = Crafty.e("snake").makeBlock(100 - BLOCKSIZE * 6, 100, "e", "e", "tailleft2");
                      this.blocks.map(function(b){b.destroy()});
                      this.blocks = [t1, t2, t3, t4, t5, t6, t7];
                    }    
                  })
                  .bind('KeyDown', function(e){
                    var head = this.blocks[0];
                    switch(e.keyCode){
                      case Crafty.keys.RIGHT_ARROW:
                        if (head.current_dir != "w"){
                          head.current_dir = "e";
                          head.next_dir = "e";
                        }
                      break;
                      case Crafty.keys.LEFT_ARROW:
                        if (head.current_dir != "e"){
                          head.current_dir = "w";
                          head.next_dir = "w";
                        }
                      break;
                      case Crafty.keys.UP_ARROW:
                        if (head.current_dir != "s"){
                          head.current_dir = "n";
                          head.next_dir = "n";
                        }
                      break;
                      case Crafty.keys.DOWN_ARROW:
                        if (head.current_dir != "n"){
                          head.current_dir = "s";
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
                    for (var i = 1; i < this.blocks.length; i++){
                      this.blocks[i].next_dir = this.blocks[i-1].current_dir;
                    };
                  });
      
                  
  };      
}
