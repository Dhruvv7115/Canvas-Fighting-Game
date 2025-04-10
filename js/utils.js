function rectangularCollision({ rect1, rect2 }){
  return (
    rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x && 
    rect1.attackBox.position.x <= rect2.position.x + rect2.width && rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y && 
    rect1.attackBox.position.y <= rect2.position.y + rect2.height)
}
function detectWinner(timerId){
  clearTimeout(timerId);
  document.querySelector('#displayMsg').style.display = 'flex';

  // Check if both fighters have a recorded death time
  if (player.deathTime && enemy.deathTime) {
    if (player.deathTime < enemy.deathTime) {
      document.querySelector('#displayMsg').innerHTML = "Kenji Wins!";
    } else if (enemy.deathTime < player.deathTime) {
      document.querySelector('#displayMsg').innerHTML = "Samurai Mack Wins!";
    } else {
      document.querySelector('#displayMsg').innerHTML = "Tie!";
    }
  } else if (player.deathTime) {
    document.querySelector('#displayMsg').innerHTML = "Kenji Wins!";
  } else if (enemy.deathTime) {
    document.querySelector('#displayMsg').innerHTML = "Samurai Mack Wins!";
  } else { // timer over winner decide on basis of health
    if (player.health === enemy.health) {
      document.querySelector('#displayMsg').innerHTML = "Tie!";
    } else if (player.health > enemy.health) {
      document.querySelector('#displayMsg').innerHTML = "Samurai Mack Wins!";
    } else {
      document.querySelector('#displayMsg').innerHTML = "Kenji Wins!";
    }
  }

  setTimeout(() => {
    game.started = false;
    document.querySelector('#displayMsg').innerHTML = '';

    document.querySelector('#restartButtonDiv').style.display = 'flex';
  }
  , 5000)

}
let timerId;
let timer = 60;
function decreaseTimer(){
  document.querySelector('#timer').innerHTML = timer;
  if(timer === 0){
    detectWinner(timerId);
  }
  if(timer>0){
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
  }
}

document.querySelector('#restartButton').addEventListener('click', () => {
  enemy.health = 100;
  player.health = 100;
  gsap.to("#enemyHealth", {
    width: `${enemy.health}%`,
    duration: 1
  });
  gsap.to("#playerHealth", {
    width: `${player.health}%`,
    duration: 1
  });
  setTimeout(() => location.reload(), 1500);

})