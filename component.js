    //inventory
    Crafty.c("inventory", {
      init: function(){
        this.addComponent("2D,Canvas")
      },
      makeItem: function(x, y, type){
        var amount = Crafty.e("2D, DOM, Text")
                              .attr({x: title.x + title.w, y: 5, w: 25, h: 20})
                              .text("0 ")
                              .css({"color": "white", "text-align": "center", "font-style": "bold", "font-family": "Comic Sans MS"});
          
      }
    });

    //snake
      Crafty.c("snake", {
          init: function(){
            this.addComponent("2D,Canvas,Collision");
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
      this.addComponent("2D, Canvas, Tween, Collision");
    },
    makeFeed: function(type){
      var max = {x: Crafty.viewport.width - 40, y: Crafty.viewport.height - 40};
      var randX = Crafty.math.randomInt(40, max.x);
      var randY = Crafty.math.randomInt(40, max.y);
      this.attr({x: randX, y: randY, w: 20, h: 20, type: type})
          .addComponent(type);
      if (this.hit("snake") || this.hit("feed")) { return this.makeFeed(type);};
      
      return this;
    },
    fadeOut: function(){
      this.tween({alpha: 0.0}, 10)
          .delay(function(){this.destroy()}, 10);
    },
  });
  //achievements
  Crafty.c('Achievement',{
      init: function(){
        this._image = Crafty.e('2D, DOM, Image, Tween').image('img/achievement.png').attr({x: 30, y: 30});
        this._text = "Set the Text";
        this._center = WIDTH / 2 - ((this._text.length * 15) / 2);
        this._textElement = Crafty.e('2D, DOM, Text, Tween').text(this._text).textColor('#dacfca').attr({x: this._center, y: 110, w:400}).textFont({weight: 'bold', size: '20px', family: 'Arial'});

        this._image.tween({alpha: 0.0}, 200);
        this._textElement.tween({alpha: 0.0}, 200);
      },

      text: function(newText) {
        this._text = newText;
        this._center = WIDTH / 2 - ((this._text.length * 12) / 2) ;
        this._textElement.attr({x: this._center}).text(this._text);
      }
     
    });

