const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('tiles', 'path/to/tileset.png');
  this.load.tilemapTiledJSON('map', 'path/to/tilemap.json');
  this.load.spritesheet('player', 'path/to/player.png', { frameWidth: 32, frameHeight: 32 });
  this.load.image('bullet', 'path/to/bullet.png');
}

function create() {
  const map = this.make.tilemap({ key: 'map' });
  const tileset = map.addTilesetImage('tilesetName', 'tiles');
  const belowLayer = map.createLayer('Below Player', tileset, 0, 0);
  const worldLayer = map.createLayer('World', tileset, 0, 0);
  const aboveLayer = map.createLayer('Above Player', tileset, 0, 0);

  worldLayer.setCollisionByProperty({ collides: true });

  player = this.physics.add.sprite(400, 300, 'player', 0);
  this.physics.add.collider(player, worldLayer);

  this.cameras.main.startFollow(player);
  this.cameras.main.setZoom(2);

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
    frameRate: 10,
    repeat: -1
  });

  this.bullets = this.physics.add.group({
    defaultKey: 'bullet',
    maxSize: 10
  });

  this.input.on('pointerdown', (pointer) => {
    const bullet = this.bullets.get(player.x, player.y);

    if (bullet) {
      this.physics.moveTo(bullet, pointer.worldX, pointer.worldY, 600);
    }
  });
}

function update() {
  const cursors = this.input.keyboard.createCursorKeys();
  const speed = 160;
  const prevVelocity = player.body.velocity.clone();

  player.body.setVelocity(0);

  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
  }

  if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
  }

  if (cursors.left.isDown) {
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.anims.play('right', true);
  } else {
    player.anims.stop();
    if (prevVelocity
