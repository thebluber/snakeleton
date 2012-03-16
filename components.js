  //component block
      Crafty.c("block", {
          init: function(){
            this.addComponent("2D,Canvas,Tween,Color");
            this.attr({w: BLOCKSIZE, h: BLOCKSIZE});  
          },
          makeBlock: function(x, y, current_dir, next_dir, color){
            this.attr({x: x, y: y, current_dir: current_dir, next_dir: next_dir, myColor: color})
                .color(this.myColor);
            return this;
          }, 
          moveTo: function(){
            this.move(this.current_dir, BLOCKSIZE);
            this.current_dir = this.next_dir; 
          }
      });
    //snake
      Crafty.c("snake", {
          init: function(){
            this.addComponent("2D,Canvas,Tween");
            this.attr({w: BLOCKSIZE, h: BLOCKSIZE});  
          },
          makeBlock: function(x, y, current_dir, next_dir, pic){
            this.attr({x: x, y: y, current_dir: current_dir, next_dir: next_dir, pic: pic, isCurve: false});
            return this;
          }, 
          moveTo: function(){
            this.move(this.current_dir, BLOCKSIZE);
            this.current_dir = this.next_dir; 
            //change picture
            var newPic = this.pic.match(/[^0-9]+/)[0];
            switch(this.current_dir){
              case "n":
                newPic += 1;
              break; 
              case "e":
                newPic += 2;
              break; 
              case "s":
                newPic += 3;
              break; 
              case "w":
                newPic += 4;
              break; 
            };
            this.removeComponent(this.pic)
                .addComponent(newPic);
            //curve

          },
          changePic: function(pic){
            if (this.pic == pic) {
              return this;
            } else {
              if (this.has(this.pic)) { 
                this.removeComponent(this.pic)
                    .attr("pic", pic)
                    .addComponent(pic);  
                return this;
              } else {
                this.addComponent(pic)
                    .attr("pic", pic);
                return this;
              }
            };
          
          },

      });
