var bg;
var gameState = "play";
var shooter, shooterImg1, shooterImg2;
var zombie, zombieImg, zombieGrp;
var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;
var life = 3, score = 0;
var explosionSound;
var losing, winning;
var bullet, bullets = 50, bulletGrp;

function preload(){
  //loading images
  bg = loadImage("assets/bg.jpeg");
  shooterImg1 = loadImage("assets/shooter_2.png");
  shooterImg2 = loadImage("assets/shooter_3.png");
  zombieImg = loadImage("assets/zombie.png");
  heart1Img = loadImage("assets/heart_1.png"); 
  heart2Img = loadImage("assets/heart_2.png"); 
  heart3Img = loadImage("assets/heart_3.png"); 
  explosionSound = loadSound("assets/explosion.mp3");
  winning = loadSound("assets/win.mp3");
  losing = loadSound("assets/lose.mp3");
}

function setup(){
  createCanvas(displayWidth, displayHeight);
  //making the shooter
  shooter = createSprite(displayWidth/5,displayHeight/2,50,50);
  shooter.addImage(shooterImg1);
  shooter.scale = 0.3;
  //shooter.debug = true;
  shooter.setCollider("rectangle",0,0,300,500);

  //creating sprites to depict lives remaining
  heart1 = createSprite(displayWidth-100,displayHeight/2 - 300,20,20);
  heart1.addImage(heart1Img);
  heart1.scale = 0.3;
  heart1.visible = false;
  heart2 = createSprite(displayWidth-100,displayHeight/2 - 300,20,20);
  heart2.addImage(heart2Img);
  heart2.scale = 0.3;
  heart2.visible = false;
  heart3 = createSprite(displayWidth-150,displayHeight/2 - 300,20,20);
  heart3.addImage(heart3Img);
  heart3.scale = 0.3;

  //making a zombie group
  zombieGrp = new Group();

  //making a bullet group
  bulletGrp = new Group();
}

function draw(){
  background(bg);
  
  if(gameState === "play"){

  if(life === 3){
    heart3.visible = true;
    heart2.visible = false;
    heart1.visible = false;
  }

  if(life === 2){
    heart3.visible = false;
    heart2.visible = true;
    heart1.visible = false;
  }

  if(life === 1){
    heart3.visible = false;
    heart2.visible = false;
    heart1.visible = true;
  }

  if(life === 0){
    heart3.visible = false;
    heart2.visible = false;
    heart1.visible = false;
    gameState = "lost";
  }

  if(score === 100){
    gameState = "won";
    winning.play();
  }

  //movement for the shooter
  if(keyDown("UP_ARROW") || touches.length > 0){
    shooter.y -= 3;
  }

  if(keyDown("DOWN_ARROW") || touches.length < 0){
    shooter.y += 3;
  }

  //changing image for shooter and release bullets when space is pressed
  if(keyWentDown("space")){
    bullet = createSprite(displayWidth/5,shooter.y - 30,20,20);
    bullet.velocityX = 20;
    bulletGrp.add(bullet);
    shooter.depth = bullet.depth;
    shooter.depth += 2;
    shooter.addImage(shooterImg2);
    bullets -= 1;
    explosionSound.play();
  }

  if(keyWentUp("space")){
    shooter.addImage(shooterImg1);
  }

  //changing gamestate to bullet when player runs out of bullets
  if(bullets === 0){
    gameState = "bullet";
    losing.play();
  }

  //destroying zombies when bullets touch them
  if(zombieGrp.isTouching(bulletGrp)){
    for(var i = 0;i < zombieGrp.length;i++){
      if(zombieGrp[i].isTouching(bulletGrp)){
        zombieGrp[i].destroy();
        bulletGrp.destroyEach();
        score += 2;
        explosionSound.play();
      }
    }
  }

  //destroying zombies when player touches them
  if(zombieGrp.isTouching(shooter)){
    for(var i = 0;i < zombieGrp.length;i++){
      if(zombieGrp[i].isTouching(shooter)){
        zombieGrp[i].destroy();
        life -= 1;
        losing.play();
      }
    }
  }

  //calling the function to spawn zombies
  enemy();
  }

  drawSprites();

  textSize(30);
  fill("white");
  text("Score:"+score,displayWidth - 400,displayHeight/2-300);
  text("Bullets:"+bullets,displayWidth - 600,displayHeight/2-300);
  text("Lives:"+life,displayWidth - 800,displayHeight/2-300);


  //when gamestate is bullet text is displayed and zombies, bullets and shooter are destroyed
  if(gameState === "bullet"){
    textSize(50);
    fill("red");
    text("The Player Has Run Out Of Bullets",displayWidth/4,displayHeight/2);
    zombieGrp.destroyEach();
    bulletGrp.destroyEach();
    shooter.destroy();
  }

  if(gameState === "lost"){
      textSize(50);
      fill("red");
      text("The Player Has Lost",displayWidth/3,displayHeight/2);
      zombieGrp.destroyEach();
      shooter.destroy();
  }

  if(gameState === "won"){
    textSize(50);
    fill("red");
    text("The Player Has Won",displayWidth/3,displayHeight/2);
    zombieGrp.destroyEach();
    shooter.destroy();
  }
}

//creating a function to spawn zombies
function enemy(){
  if(frameCount % 70 === 0){
    zombie = createSprite(random(400,1000),random(100,500),50,50);
    zombie.addImage(zombieImg);
    zombie.scale = 0.15;
    zombie.velocityX = -3;
    //zombie.debug = true;
    zombie.setCollider("rectangle",0,0,350,900);
    zombie.lifetime = 400;
    zombieGrp.add(zombie);
  }
}
