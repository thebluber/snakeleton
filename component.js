
    //snake
      Crafty.c("snake", {
          init: function(){
            this.addComponent("2D,Canvas");
            this.attr({w: BLOCKSIZE, h: BLOCKSIZE});  
          },
          makeBlock: function(x, y, current_dir, next_dir, pic){
            this.addComponent(pic)
                .attr({x: x, y: y, current_dir: current_dir, next_dir: next_dir, pic: pic, curve: false});
            return this;
          }, 
          moveTo: function(){
            this.move(this.current_dir, BLOCKSIZE);

            var pic = this.pic.match(/[^0-9]+/)[0];
            switch(this.next_dir){
              case "n":
                this.changePic(pic + 1)
                    .pic = pic + 1;
              break;
              case "e":
                this.changePic(pic + 2)
                    .pic = pic + 2;
              break;
              case "s":
                this.changePic(pic + 3)
                    .pic = pic + 3;
              break;
              case "w":
                this.changePic(pic + 4)
                    .pic = pic + 4;
              break;
              default:
                return;
              break;
            };
            var isBody = pic.match("body");
            if (isBody && this.current_dir != this.next_dir){
              this.curve = true;
              var dir = this.next_dir + this.current_dir;
              this.changePic("curve" + dir.toUpperCase());
            } else {
              this.curve = false;
            };
            this.current_dir = this.next_dir; 

          },
          changePic: function(pic){
              this.removeComponent(this.pic)
                  .addComponent(pic);
              return this;
          },
          animation: function(){
            var pic = this.pic.match(/[^0-9]+/)[0];
            if(!this.curve){
              if (pic.match("left")) {
                this.changePic(this.pic.replace("left", "right"))
                    .pic = this.pic.replace("left", "right");
              };
              if (pic.match("right")) {
                this.changePic(this.pic.replace("right", "left"))
                    .pic = this.pic.replace("right", "left");
              };
            };
            return this;
             
          },

      });

  //feed
  Crafty.c("feed", {
    init: function(){
      this.addComponent("2D, Canvas, Tween");
    },
    makeFeed: function(type){
      var max = {x: Crafty.viewport.width - 40, y: Crafty.viewport.height - 40};
      var randX = Crafty.math.randomInt(40, max.x);
      var randY = Crafty.math.randomInt(40, max.y);
      this.attr({x: randX, y: randY, w: 20, h: 20, type: type})
          .addComponent(type);
      return this;
    },
    fadeOut: function(){
      this.tween({alpha: 0.0}, 10);
    }
  });
