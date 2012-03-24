window.onload = function(){
  
    // Deactivate scrolling with arrow keys
    document.onkeydown=function(){return event.keyCode!=38 && event.keyCode!=40}  

    BLOCKSIZE = 20;
    WIDTH = 43 * BLOCKSIZE;
    HEIGHT = 24 * BLOCKSIZE;
  //init Crafty
    Crafty.init(WIDTH, HEIGHT);
    //loading
      Crafty.scene("loading", function(){
        Crafty.load(["img/achievement.png","img/igel.png","img/sssssnakeleton.png","img/snakeleton.png", "img/kaninchen.png", "img/steak.png", "img/herz.png", "img/herz_sw.png"], function() {
          Crafty.scene("main");
        });
        Crafty.background("#000");
        Crafty.e("2D, DOM, Text").attr({ w: 150, h: 20, x: Crafty.viewport.width / 2 - 70, y: Crafty.viewport.height / 2 - 10})
              .text("LOADING...")
              .css({ "text-align": "center", "color": "white", "font-size": "300%", "font-style": "bold", "font-family": "Impact"});
         
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
    Crafty.sprite(40, "img/igel.png", {
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
                          .attr({x: 0, y: 0, w: Crafty.viewport.width, h: 30})
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

      var title = Crafty.e("2D, DOM, Text")
                    .attr({x: l3.x + l3.w + 5, y: 5, w: 120, h: 20})
                    .text("INVENTORY: ")
                    .css({"color": "white", "text-align": "center", "font-style": "bold", "font-family": "Comic Sans MS"});
      Crafty.e("inventory").attr({item: title});             
      
      //generate feeds 
      var FEEDS = ["rabbit", "steak"];
      var regenerateFeed = function() {
        var rand = Math.floor(Math.random() * FEEDS.length);
        var feed = Crafty.e('feed').makeFeed(FEEDS[rand]);
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
          var inventory = Crafty("inventory");
          var isItem = false;
          for(var i = 0; i < inventory.length; i++){
            isItem = isItem || Crafty(inventory[i]).item.has(feed.type);
          }
          if (isItem){
            snake.inventory[feed.type] += 1;
            var inventory = Crafty("inventory");
            for (var i = 0; i < inventory.length; i++){
              Crafty(inventory[i]).update(feed.type, snake.inventory[feed.type]);
            };
          } else {
            //update snake inventory list
            snake.inventory[feed.type] = 0;
            var lastItem = Crafty(inventory[inventory.length - 1]);
            Crafty.e("inventory").makeItem(lastItem.item.x + lastItem.item.w + 25, feed.type);
            //trigger achievement
            achievements[feed.type] = true;
            Crafty.e('Achievement').text("ONOMNOM Discovery: " + feed.type);
          }
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

      //achievements
      var achievements = {};

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
                                           .attr({x: 0, y: -10, w: WIDTH, h: HEIGHT})
                                           .tween({alpha: 0.5}, 5);
                      var gameOver = Crafty.e("2D, DOM, Text, Tween")
                                           .attr({x: background.x + 30, y: background.h / 2 - 100, w: WIDTH * 0.7, h: HEIGHT, fadeOut: false})
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
                      if (Crafty("feed").length == 0 && !GAMEOVER && !Timer.STOP){
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
                      if (bite) { 
                        //create a new snake
                        this.blocks.map(function(b){b.destroy()});
                        var t1 = Crafty.e("snake").makeBlock(200, 100, "e", "e", "head2").addComponent("head");
                        var t2 = Crafty.e("snake").makeBlock(200 - BLOCKSIZE, 100, "e", "e", "neckleft2");
                        var t3 = Crafty.e("snake").makeBlock(200 - BLOCKSIZE * 2, 100, "e", "e", "bodyright2");
                        var t4 = Crafty.e("snake").makeBlock(200 - BLOCKSIZE * 3, 100, "e", "e", "bodyleft2");
                        var t5 = Crafty.e("snake").makeBlock(200 - BLOCKSIZE * 4, 100, "e", "e", "bodyright2");
                        var t6 = Crafty.e("snake").makeBlock(200 - BLOCKSIZE * 5, 100, "e", "e", "bodyleft2");
                        var t7 = Crafty.e("snake").makeBlock(200 - BLOCKSIZE * 6, 100, "e", "e", "tailleft2");
                        this.blocks = [t1, t2, t3, t4, t5, t6, t7];
                        Timer.stop();
                        this.delay(function(){
                            this.lives -= 1;
                            Timer.resume();
                            }, 1000);
                        
                      };
                      //achievements
                      var steakText = this.inventory.steak + "th " + "STEAK!"
                      if (!achievements[steakText] && this.inventory.steak != 0 && this.inventory.steak % 30 == 0){
                        achievements[steakText] = true;
                        Crafty.e("Achievement").text(steakText);
                        if (this.lives < 3){
                          this.lives += 1;
                          this.inventory.steak = 0;
                          return Crafty(Crafty("noHeart")[0]).removeComponent("noHeart").addComponent("heart");
                        }
                      };
                      //hedgehog appears
                      var hedgehogText = "NOOO A HEDGEHOG!"
                      if (this.inventory.steak + this.inventory.rabbit == 15 && !achievements[hedgehogText]){
                          Crafty.e("Achievement").text(hedgehogText);
                          achievements[hedgehogText] = true;
                          if (FEEDS.indexOf("hedgehog") == -1){
                            FEEDS.push("hedgehog");
                          }
                      };
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
