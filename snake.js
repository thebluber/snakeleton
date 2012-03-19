window.onload = function(){
    BLOCKSIZE = 20;
    WIDTH = 44 * BLOCKSIZE;
    HEIGHT = 28 * BLOCKSIZE;
  //init Crafty
    Crafty.init(WIDTH, HEIGHT);
    //loading
      Crafty.scene("loading", function(){
        Crafty.load(["img/snakeleton.png", "img/kaninchen.png", "img/bigsteak.png"], function() {
          Crafty.scene("main");
        });
        Crafty.background("#000");
        Crafty.e("2D, DOM, Text").attr({ w: 100, h: 20, x: 150, y: 120 })
              .text("Loading")
              .css({ "text-align": "center" });
         
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
    Crafty.sprite(40, "img/bigsteak.png", {
      steak: [0, 0]
    })

  //Initialize Timer
    var Timer = Crafty.e("Timer").resume(); 
  
  //main scene
    Crafty.scene("main", function(){
      Crafty.background("black");
      start();
    });
    var start = function(){
      var feeds = ["rabbit", "steak"];
      var feed = Crafty.e("feed").makeFeed(feeds[Crafty.math.randomInt(0, 1)]);
      //create a snake
      var t1 = Crafty.e("snake").makeBlock(100, 100, "e", "e", "head2");
      var t2 = Crafty.e("snake").makeBlock(100 - BLOCKSIZE, 100, "e", "e", "neckleft2");
      var t3 = Crafty.e("snake").makeBlock(100 - BLOCKSIZE * 2, 100, "e", "e", "bodyright2");
      var t4 = Crafty.e("snake").makeBlock(100 - BLOCKSIZE * 3, 100, "e", "e", "bodyleft2");
      var t5 = Crafty.e("snake").makeBlock(100 - BLOCKSIZE * 4, 100, "e", "e", "bodyright2");
      var t6 = Crafty.e("snake").makeBlock(100 - BLOCKSIZE * 5, 100, "e", "e", "bodyleft2");
      var t7 = Crafty.e("snake").makeBlock(100 - BLOCKSIZE * 6, 100, "e", "e", "tailleft2");
      var snake = Crafty.e("2D,Canvas")
                  .attr({blocks:[t1,t2,t3,t4,t5,t6,t7]})
                  .bind("timerTick", function(e){
                    var head = this.blocks[0];
                    //move snake
                    head.moveTo();
                    for (var i = 1; i < this.blocks.length; i++){
                      this.blocks[i].moveTo();
                      this.blocks[i].animation();
                      this.blocks[i].next_dir = this.blocks[i-1].current_dir;
                      
                    };
                    //is the snake within the boundary
                    var minBoundary = {x: 0, y: 0};
                    var maxBoundary = {x: WIDTH, y: HEIGHT};
                    var isWithin = this.blocks.reduce(function(res, e){

                                      return res && e.within(minBoundary.x, minBoundary.y, maxBoundary.x, maxBoundary.y)

                                   });
                    //collision check: feed and snake
                    var eatFeed = head.intersect(feed.x, feed.y, feed.w, feed.h);
                    //collision check: head and tail
                    var bite = this.blocks.slice(1).reduce(function(res, t){
                      return res || t.intersect(head.x, head.y, BLOCKSIZE, BLOCKSIZE);
                      }, false); 
                    
                    if (eatFeed) {
                      feed.destroy();
                      feed = Crafty.e("feed").makeFeed(feeds[Crafty.math.randomInt(0,1)]);
                      var lastBody = this.blocks[this.blocks.length - 2];
                      var newBody = Crafty.e("snake").makeBlock(lastBody.x, lastBody.y, "", lastBody.current_dir, lastBody.pic);
                      this.blocks.splice(this.blocks.length - 1, 0, newBody);
                      console.log(this.blocks.length);
                      //adjust tail
                      lastBody = this.blocks[this.blocks.length - 2];
                      var tail = this.blocks[this.blocks.length - 1];
                      var pic = tail.pic;
                      tail.destroy();
                      this.blocks[this.blocks.length - 1] = Crafty.e("snake").makeBlock(lastBody.x, lastBody.y, "", lastBody.current_dir, pic);
                      
                    };
                      
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
