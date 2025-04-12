const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);


const gravity = 1.2;

const background = new Sprite({
  position:{
    x: 0,
    y: 0
  },
  imageSrc: './images/background.png',
  
})
const shop = new Sprite({
  position:{
    x: 625,
    y: 128
  },
  imageSrc: './images/shop.png',
  scale: 2.75,
  maxFrames: 6
})

const player = new Fighter({
  position: {
    x: 100,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset:{
    x: 0,
    y: 0
  },
  imageSrc: './images/samuraiMack/Idle.png',
  maxFrames: 8,
  scale: 2.5,
  offset:{
    x: 215,
    y: 157
  },
  sprites: {
    idle:{
      imageSrc: './images/samuraiMack/Idle.png',
      maxFrames: 8
    },
    run:{
      imageSrc: './images/samuraiMack/Run.png',
      maxFrames: 8
    },
    jump:{
      imageSrc: './images/samuraiMack/Jump.png',
      maxFrames: 2
    },
    fall:{
      imageSrc: './images/samuraiMack/Fall.png',
      maxFrames: 2
    },
    attack1:{
      imageSrc: './images/samuraiMack/Attack1.png',
      maxFrames: 6
    },
    takeHit:{
      imageSrc: './images/samuraiMack/TakeHitWhite.png',
      maxFrames: 4
    },
    death:{
      imageSrc: './images/samuraiMack/Death.png',
      maxFrames: 6
    }
  },
  attackBox:{
    offset: {
      x: 70,
      y: 40
    },
    width: 185,
    height: 50,
  }
});
player.draw();

const enemy = new Fighter({
  position: {
    x: 800,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset:{
    x: 0,
    y: 0
  },
  imageSrc: './images/kenji/Idle.png',
  maxFrames: 4,
  scale: 2.5,
  offset:{
    x: 215,
    y: 170
  },
  sprites: {
    idle:{
      imageSrc: './images/kenji/Idle.png',
      maxFrames: 4
    },
    run:{
      imageSrc: './images/kenji/Run.png',
      maxFrames: 8
    },
    jump:{
      imageSrc: './images/kenji/Jump.png',
      maxFrames: 2
    },
    fall:{
      imageSrc: './images/kenji/Fall.png',
      maxFrames: 2
    },
    attack1:{
      imageSrc: './images/kenji/Attack1.png',
      maxFrames: 4
    },
    takeHit:{
      imageSrc: './images/kenji/takeHitWhite.png',
      maxFrames: 3
    },
    death:{
      imageSrc: './images/kenji/Death.png',
      maxFrames: 7
    }
  },
  attackBox:{
    offset: {
      x: -172,
      y: 60
    },
    width: 172,
    height: 50,
  }
});
enemy.draw();

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  }
}

// decreaseTimer();

const game = {
  started: false,
  winner: 'none'
}

function animate(){
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = 'rgba(255,255,255,0.15)';
  c.fillRect(0, 0, canvas.width, canvas.height);

  if(!game.started) return
  enemy.update();
  player.update();

  //player movement

  //x-axis

  player.velocity.x = 0;

  if(keys.a.pressed && player.lastKey === 'a'){
    if(player.position.x >= 0){
      player.velocity.x = -5;
      player.switchState('run');
    }
  } else if(keys.d.pressed && player.lastKey === 'd'){
    if(player.position.x <= 950){
      player.velocity.x = 5;
      player.switchState('run');
    }
  } else{
    player.switchState('idle');
  }

  //y-axis

  if(player.velocity.y < 0){
    player.switchState('jump');
  } else if(player.velocity.y > 0){
    player.switchState('fall');
  }

  //enemy movement

  //x-axis

  enemy.velocity.x = 0;

  if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
    if(enemy.position.x >= 0){ //blocking enemy to go out of screen from left-side
      enemy.velocity.x = -5;
      enemy.switchState('run');
    }
  }else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
    if(enemy.position.x <= 950){
      enemy.velocity.x = 5;
      enemy.switchState('run');
    }
  } else{
    enemy.switchState('idle');
  }

  //y-axis

  if(enemy.velocity.y < 0){
    enemy.switchState('jump');
  } else if(enemy.velocity.y > 0){
    enemy.switchState('fall');
  }

  // collision detection

  // player attacks and enemy gets hit
  if(rectangularCollision({
    rect1: player,
    rect2: enemy
  }) && player.isAttacking 
  && !enemy.deathTime
  && player.currentFrame === 4){
    // enemy.takeHit()
    if(!player.dead){
      enemy.health -= 15;
      if(enemy.health <= 0){
        enemy.health = 0;
        enemy.dead = true;
        enemy.deathTime = Date.now();
        // console.log(enemy.deathTime);
        enemy.switchState('death');
      }else {
        enemy.switchState('takeHit');
      }
    }
    player.isAttacking = false;
    gsap.to("#enemyHealth", {
      width: `${enemy.health}%`,
      duration: 0.5
    });
  }

  // if player misses
  if(player.isAttacking && player.currentFrame === 4){
    player.isAttacking = false;
  }

  // enemy attacks and player gets hit
  if(rectangularCollision({
    rect1: enemy,
    rect2: player
  }) && enemy.isAttacking 
  && !player.deathTime
  && enemy.currentFrame === 2){
    if(!enemy.dead){
      player.health -= 10;
      if(player.health <= 0){
        player.health = 0;
        player.dead = true;
        player.deathTime = Date.now();
        // console.log(player.deathTime);
        player.switchState('death');
      }else {
        player.switchState('takeHit');
      }
    }
    enemy.isAttacking = false;
    gsap.to("#playerHealth", {
      width: `${player.health}%`,
      duration: 0.25
    });
  }

  // if enemy misses
  if(enemy.isAttacking && enemy.currentFrame === 2){
    enemy.isAttacking = false;
  }

  //deciding winner on the bases of health
  if(enemy.health <= 0  || player.health <= 0){
    detectWinner(timerId);
  }
}
animate();

document.querySelector('#beginButton').addEventListener('click', () => {
  // document.querySelector('#beginButton').style.display = 'none'
  document.querySelector('#beginButton').classList.add('hidden');

  document.querySelector('#tutorial').style.display = 'flex';
})

document.querySelector('#startButton').addEventListener('click', () => {
  decreaseTimer();
  document.querySelector('#tutorial').style.display = 'none';
  game.started = true;
})

window.addEventListener('keydown', (event) => {
  if(!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true;
        player.lastKey = 'd';
        break;
      case 'a':
        keys.a.pressed = true;
        player.lastKey = 'a';
        break;
      case 'w':
        if(player.velocity.y === 0) player.velocity.y = -20
        break;
      case ' ':
        player.attack();
        break;
    }
  }

  if(!enemy.dead){
    switch (event.key) {
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = 'ArrowLeft'
        break;
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight'
        break;
      case 'ArrowUp':
        if(enemy.velocity.y === 0) enemy.velocity.y = -20
        break;
      case 'ArrowDown':
        enemy.attack();
        break;
    }
  }
})
window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
  }
})