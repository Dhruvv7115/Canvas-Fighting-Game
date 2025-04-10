class Sprite{
  constructor({ position, imageSrc,scale=1, maxFrames=1, offset={
    x:0,
    y:0,
   }
  }){
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
    this.imageLoaded = false;
    this.image.onload = () => {
      this.imageLoaded = true;
    };
    this.scale = scale;
    this.maxFrames = maxFrames;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
  }

  draw(){ 
    if (!this.imageLoaded) return;
    c.drawImage( 
      this.image,
      this.currentFrame*(this.image.width/this.maxFrames),
      0, 
      this.image.width/this.maxFrames, 
      this.image.height, 
      this.position.x - this.offset.x,
      this.position.y -this.offset.y,
      (this.image.width / this.maxFrames) * this.scale, 
      this.image.height * this.scale)
  }

  animateFrames(){
    this.framesElapsed++;
    if(this.framesElapsed % this.framesHold == 0){
      if (this.currentFrame < this.maxFrames - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }

  update(){
    this.draw();
    this.animateFrames();
  }
}
class Fighter extends Sprite{
  constructor({
    position,
    velocity,
    color='red',
    imageSrc,
    scale=1,
    maxFrames=1,
    offset={
      x:0,
      y:0,
    },
    sprites,
    attackBox = {
      width: undefined,
      height: undefined,
      offset: {
        x: 0,
        y: 0,
      }
    }
  }){
    super({ position, imageSrc, maxFrames, scale, offset });
    this.velocity = velocity;
    this.color = color;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      width: attackBox.width,
      height: attackBox.height,
      offset: attackBox.offset
    }
    this.isAttacking;
    this.health = 100;

    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;
    this.dead = false;
    this.animate = true;
    this.deathTime;

    for(const sprite in this.sprites){
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  update(){
    this.draw();
    if(this.animate) {
      this.animateFrames();
    }

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // c.fillStyle='red'
    // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);

    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if(this.position.y + this.height + this.velocity.y >= canvas.height - 97){
      this.velocity.y = 0;
      this.position.y = 330;
    } else this.velocity.y += gravity;
  }

  attack(){
    this.isAttacking = true;
    this.switchState('attack1');
  }

  switchState(state){
    if(this.image === this.sprites.death.image) {
      if(this.currentFrame === this.sprites.death.maxFrames - 1)
        this.animate = false;
      return;
    };
    if(this.image === this.sprites.attack1.image
      && this.currentFrame < this.sprites.attack1.maxFrames - 1
      && state !== 'death') return;
    if(this.image === this.sprites.takeHit.image
      && this.currentFrame < this.sprites.takeHit.maxFrames - 1
      && state !== 'death' && state !== 'attack1') return;
    switch(state){
      case 'idle':
        if(this.image !== this.sprites.idle.image){
          this.image = this.sprites.idle.image;
          this.maxFrames = this.sprites.idle.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case 'run':
        if(this.image !== this.sprites.run.image){
          this.image = this.sprites.run.image;
          this.maxFrames = this.sprites.run.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case 'jump':
        if(this.image !== this.sprites.jump.image){
          this.image = this.sprites.jump.image;
          this.maxFrames = this.sprites.jump.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case 'fall':
        if(this.image !== this.sprites.fall.image){
          this.image = this.sprites.fall.image;
          this.maxFrames = this.sprites.fall.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case 'attack1':
        if(this.image !== this.sprites.attack1.image){
          this.image = this.sprites.attack1.image;
          this.maxFrames = this.sprites.attack1.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case 'takeHit':
        if(this.image !== this.sprites.takeHit.image){
          this.image = this.sprites.takeHit.image;
          this.maxFrames = this.sprites.takeHit.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case 'death':
        if(this.image !== this.sprites.death.image){
          this.image = this.sprites.death.image;
          this.maxFrames = this.sprites.death.maxFrames;
          this.currentFrame = 0;
        }
        break;
    }
  }
}