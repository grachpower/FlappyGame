var game = new Phaser.Game(600, 600, Phaser.AUTO, '');
var topScore = 0;
var topScoreText;
var lastScore = 0;
var userName = "GUEST";
var isSpacePressed = false;

//game inside prototype
playingState = function () {};
playingState.prototype = {

	preload: function () {
		this.game.stage.backgroundColor = '#71c5cf';
		this.game.load.spritesheet('chicken', 'assets/narutomini.png', 56, 54);
		this.game.load.image('pipe', 'assets/pipe2.png');
		this.game.load.image('cloud', 'assets/cloudnew.png');
		this.game.load.image('ground', 'assets/ground.png');
	},

	create: function () {

		this.score = 0;

		//init chicken
		this.chicken = this.game.add.sprite(270, 270, 'chicken');
		//enable chicken physics
		this.game.physics.arcade.enable(this.chicken);
		//set chicken gravity Y
		this.chicken.body.gravity.y = 1000;
		//		this.chicken.body.collideWorldBounds = true;

		//set chicken animation
		this.chicken.animations.add('fly', [1, 2, 3], 5, true);
		this.chicken.animations.play('fly');

		//make pipe group
		this.pipes = this.game.add.group();
		this.pipes.enableBody = true;

		//timer to make ne pipes
		//this.pipeTimer =
		this.game.time.events.loop(1500, this.add_row_pipes, this);

		//set score timer
		//this.scoreTimer =
		this.game.time.events.loop(500, this.calcScore, this, false);

		//create clouds
		this.clouds = this.game.add.group();
		this.clouds.enableBody = true;
		this.game.time.events.loop(1500, this.startClouds, this, false);

		//create grounds group
		this.grounds = this.game.add.group();
		this.grounds.enableBody = true;
		this.game.time.events.loop(5000, this.startGround, this);
		//first ground start on start
		this.ground1 = this.grounds.create(0, 575, 'ground');
		this.ground1.body.velocity.x = -200;
		if (this.ground1.inWorld == false) {
			this.ground1.kill;
		};
		//second ground on start
		this.ground2 = this.grounds.create(600, 575, 'ground');
		this.ground2.body.velocity.x = -200;
		if (this.ground2.inWorld == false) {
			this.ground2.kill;
		};

		this.scoreText = this.game.add.text(30, 30, 'score: 0', {
			fontSize: '24px',
			fill: 'blue'
		});

		this.jumpkey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.jumpkey.onDown.add(this.jump, this)
	},

	update: function () {
		//restart game when drops under||over world
		if (this.chicken.inWorld == false) {
			this.restartGame();
		};

		//jump on Tap
		if (this.input.activePointer.isDown) {
			this.jump();
		};

		//restart game if chicken overlaps the pipe
		this.game.physics.arcade.overlap(this.chicken, this.pipes, this.restartGame, null, this);
		this.game.physics.arcade.overlap(this.chicken, this.grounds, this.restartGame, null, this);
	},

	//create one pipe
	add_one_pipe: function (x, y) {
		this.pipe = this.pipes.create(x, y, 'pipe');
		this.pipe.body.velocity.x = -200;
		if (this.pipe.inWorld == false) {
			this.pipe.kill;
		};
	},

	//create 6 pipes & hole
	add_row_pipes: function () {
		var hole = Math.floor(Math.random() * 5) + 1;

		for (var i = 0; i < 8; i++) {
			if (i != hole && i !== (hole + 1)) {
				this.add_one_pipe(600, i * 80);
			};
		};
	},

	startClouds: function () {
		var rate = Math.floor(Math.random() * 100) + 100;
		this.cloud = this.clouds.create(600, 15, 'cloud');
		this.cloud.body.velocity.x = -rate;
		if (this.cloud.inWorld == false) {
			this.cloud.kill;
		};
	},

	startGround: function () {
		this.ground = this.grounds.create(600, 575, 'ground');
		this.ground.body.velocity.x = -200;
		if (this.ground.inWorld == false) {
			this.ground.kill;
		};
	},

	restartGame: function () {
		if (this.score > topScore) {
			topScore = this.score;
		};
		lastScore = this.score;
		this.chicken.animations.stop();
		this.chicken.frame = 3;
		this.jump();
		this.chicken.body.velocity.x = -400;

		//------------------ajax bad down------------------//
		//set user paratemers
		var xhr = new XMLHttpRequest();

		this.userName = userName;

		var requestStr = "/setUser?" + "name=" + this.userName + "&score=" + this.score;
		console.log(requestStr);

		xhr.open('GET', requestStr, true);
		// xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xhr.onreadystatechange = function() {
			// console.log(xhr.readyState + " получено символов:" + xhr.responseText);
		};
		xhr.send();
		//------------------ajax bad up------------------//
		setTimeout(function () {
			this.game.state.start('mainMenuState')
		}, 400);
	},

	//add chicken vertical speed
	jump: function () {
		this.chicken.body.velocity.y = -370;
	},

	//this increment score & show this
	calcScore: function () {
		this.score += 10;
		this.scoreText.text = 'score: ' + this.score;
	},
};

//main menu prototype
mainMenuState = function () {};
mainMenuState.prototype = {

	preload: function () {
		this.game.stage.backgroundColor = '#71c5cf';
		this.game.load.spritesheet('chicken', 'assets/narutomini.png', 56, 54);
		this.game.load.image('cloud', 'assets/cloudnew.png');
		this.game.load.image('ground', 'assets/ground.png');
		this.game.load.image('scoreBack', 'assets/scoreBack.png');
	},

	create: function () {

		this.timerIndex = 2;

		this.scoreBack = this.game.add.sprite(175, 100, 'scoreBack');

		if (lastScore > 0) {
			this.game.add.text(194, 70, 'Your last score: ' + lastScore, {
				fontSize: '24px',
				fontFamily: 'Times',
				fill: 'blue',
			});
		};

		this.game.add.text(250, 105, 'TOP TEN', {
			fontSize: '24px',
			fontFamily: 'Times',
			fill: '#FFF',
		});

		this.game.add.text(195, 400, userName + ': ' + topScore, {
			fontSize: '20px',
			fontFamily: 'Times',
			fill: '#FFF',
		});

		this.game.add.text(235, 435, 'Tap to start', {
			fontSize: '24px',
			fontFamily: 'Roboto',
			fill: 'blue',
		});

		//add my references
		this.game.add.text(250, 505, 'FOLLOW ME:', {
			fontSize: '14px',
			fontFamily: 'Roboto',
			fill: 'blue',
		});
		this.game.add.text(225, 525, 'github.com/grachpower', {
			fontSize: '12px',
			fontFamily: 'Roboto',
			fill: 'blue',
		});
		this.game.add.text(226, 545, 'http://vk.com/i32646179', {
			fontSize: '12px',
			fontFamily: 'Roboto',
			fill: 'blue',
		});

		this.timerText = this.game.add.text(280, 447, '', {
			fontSize: '60px',
			fill: 'red'
		});

		//create clouds
		this.clouds = this.game.add.group();
		this.clouds.enableBody = true;
		this.game.time.events.loop(1500, this.startClouds, this, false);

		//create ground
		this.grounds = this.game.add.group();
		this.grounds.enableBody = true;
		this.game.time.events.loop(5000, this.startGround, this);
		//first ground start on start
		this.ground1 = this.grounds.create(0, 575, 'ground');
		this.ground1.body.velocity.x = -200;
		if (this.ground1.inWorld == false) {
			this.ground1.kill;
		};
		//second ground on start
		this.ground2 = this.grounds.create(600, 575, 'ground');
		this.ground2.body.velocity.x = -200;
		if (this.ground2.inWorld == false) {
			this.ground2.kill;
		};

		//------------------ajax bad down------------------//
		var xhr = new XMLHttpRequest();
		xhr.open('GET', '/getUsers', true);
		xhr.send();
		var topUsers;
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 3){
				// console.log(xhr.responseText);
				topUsers = JSON.parse(xhr.responseText);
				// topUsers = xhr.responseText;
				// console.log(topUsers);
				// console.log(xhr.responseText);
			}
		};
		//------------------ajax bad up------------------//
		setTimeout(function (){
			// console.log(topUsers);
			this.deftextheight = 150;
			for (var i = 0; i < 10; i++){
				this.game.add.text(195, this.deftextheight, topUsers[i].user + ": " + topUsers[i].score, {
					fontSize: '20px',
					fontFamily: 'Roboto',
					fill: '#FFF',
				});
				this.deftextheight += 22;
				if (i == topUsers.length-1) i = 10;
			};
		}, 600);
		;

		this.jumpkey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.jumpkey.onDown.add(function () {

			if (!isSpacePressed){
				isSpacePressed = true;
				this.timerText.text = '2';
				this.game.time.events.loop(950, this.startTimer, this, false);
				setTimeout(function () {
					this.game.state.start('playingState');
					setTimeout(function () {
						isSpacePressed = false;
					}, 1950);
				}, 2000);
			}
		}, this);

	},

	startTimer: function () {
		this.timerIndex--;
		this.timerText.text = this.timerIndex;
	},

	update: function () {
		if (this.input.activePointer.isDown) {
			setTimeout(function () {
				this.game.state.start('playingState');
			}, 300)
		};
	},

	startClouds: function () {
		var rate = Math.floor(Math.random() * 100) + 100;
		this.cloud = this.clouds.create(600, 15, 'cloud');
		this.cloud.body.velocity.x = -rate;
		if (this.cloud.inWorld == false) {
			this.cloud.kill;
		};
	},

	startGround: function () {
		this.ground = this.grounds.create(600, 575, 'ground');
		this.ground.body.velocity.x = -200;
		if (this.ground.inWorld == false) {
			this.ground.kill;
		};
	},
};

startUpState = function (){};
startUpState.prototype = {

	preload: function () {
		this.game.stage.backgroundColor = '#71c5cf';
		this.game.load.spritesheet('chicken', 'assets/narutomini.png', 56, 54);
		this.game.load.image('cloud', 'assets/cloudnew.png');
		this.game.load.image('ground', 'assets/ground.png');
		this.game.load.image('buttonUp', 'assets/button.png');

		this.game.load.audio('ridersSound', 'assets/riders.mp3')
	},

	create: function () {

		this.music = game.add.audio('ridersSound');
		this.music.play();

		setInterval(function () {
			this.music = game.add.audio('ridersSound');
			this.music.play();
		}, 420000);

		this.game.add.text(180, 170, 'TYPE UR NAME', {
			fontSize: '30px',
			fontFamily: 'Times',
			fill: 'blue',
		});

		this.inputName = this.game.add.text(220, 230, userName, {
			fontSize: '36px',
			fontFamily: 'Times',
			fill: 'RED',
		});

		//add my references
		this.game.add.text(250, 505, 'FOLLOW ME:', {
			fontSize: '14px',
			fontFamily: 'Roboto',
			fill: 'blue',
		});
		this.game.add.text(225, 525, 'github.com/grachpower', {
			fontSize: '12px',
			fontFamily: 'Roboto',
			fill: 'blue',
		});
		this.game.add.text(226, 545, 'http://vk.com/i32646179', {
			fontSize: '12px',
			fontFamily: 'Roboto',
			fill: 'blue',
		});

		//add clickable button
		this.button = this.game.add.button(250, 300, 'buttonUp', this.actionOnClick, this);

		//create clouds
		this.clouds = this.game.add.group();
		this.clouds.enableBody = true;
		this.game.time.events.loop(1500, this.startClouds, this, false);

		//create ground
		this.grounds = this.game.add.group();
		this.grounds.enableBody = true;
		this.game.time.events.loop(5000, this.startGround, this);
		//first ground start on start
		this.ground1 = this.grounds.create(0, 575, 'ground');
		this.ground1.body.velocity.x = -200;
		if (this.ground1.inWorld == false) {
			this.ground1.kill;
		};
		//second ground on start
		this.ground2 = this.grounds.create(600, 575, 'ground');
		this.ground2.body.velocity.x = -200;
		if (this.ground2.inWorld == false) {
			this.ground2.kill;
		};

		//init keyboard
		this.keyQ = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
		this.keyQ.onDown.add(function () {
			userName += 'Q';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyW = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.keyW.onDown.add(function () {
			userName += 'W';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyE = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
		this.keyE.onDown.add(function () {
			userName += 'E';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyR = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
		this.keyR.onDown.add(function () {
			userName += 'R';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyT = this.game.input.keyboard.addKey(Phaser.Keyboard.T);
		this.keyT.onDown.add(function () {
			userName += 'T';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyY = this.game.input.keyboard.addKey(Phaser.Keyboard.Y);
		this.keyY.onDown.add(function () {
			userName += 'Y';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyU = this.game.input.keyboard.addKey(Phaser.Keyboard.U);
		this.keyU.onDown.add(function () {
			userName += 'U';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyI = this.game.input.keyboard.addKey(Phaser.Keyboard.I);
		this.keyI.onDown.add(function () {
			userName += 'I';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyO = this.game.input.keyboard.addKey(Phaser.Keyboard.O);
		this.keyO.onDown.add(function () {
			userName += 'O';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyP = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
		this.keyP.onDown.add(function () {
			userName += 'P';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyA = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.keyA.onDown.add(function () {
			userName += 'A';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyS = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.keyS.onDown.add(function () {
			userName += 'S';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyD = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
		this.keyD.onDown.add(function () {
			userName += 'D';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyF = this.game.input.keyboard.addKey(Phaser.Keyboard.F);
		this.keyF.onDown.add(function () {
			userName += 'F';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyG = this.game.input.keyboard.addKey(Phaser.Keyboard.G);
		this.keyG.onDown.add(function () {
			userName += 'G';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyH = this.game.input.keyboard.addKey(Phaser.Keyboard.H);
		this.keyH.onDown.add(function () {
			userName += 'H';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyJ = this.game.input.keyboard.addKey(Phaser.Keyboard.J);
		this.keyJ.onDown.add(function () {
			userName += 'J';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyK = this.game.input.keyboard.addKey(Phaser.Keyboard.K);
		this.keyK.onDown.add(function () {
			userName += 'K';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyL = this.game.input.keyboard.addKey(Phaser.Keyboard.L);
		this.keyL.onDown.add(function () {
			userName += 'L';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyZ = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
		this.keyZ.onDown.add(function () {
			userName += 'Z';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyX = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
		this.keyX.onDown.add(function () {
			userName += 'X';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyC = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
		this.keyC.onDown.add(function () {
			userName += 'C';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyV = this.game.input.keyboard.addKey(Phaser.Keyboard.V);
		this.keyV.onDown.add(function () {
			userName += 'V';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyB = this.game.input.keyboard.addKey(Phaser.Keyboard.B);
		this.keyB.onDown.add(function () {
			userName += 'B';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyN = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
		this.keyN.onDown.add(function () {
			userName += 'N';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyM = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
		this.keyM.onDown.add(function () {
			userName += 'M';
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x - 10;
		}, this);
		this.keyBackSpace = this.game.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
		this.keyBackSpace.onDown.add(function () {
			userName = userName.substring(0, userName.length-1);
			this.inputName.text = userName;
			this.inputName.x = this.inputName.x + 10;
		}, this);
		this.keyEnter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		this.keyEnter.onDown.add(function () {
			this.game.state.start('mainMenuState');
		}, this);

	},

	update: function () {
		// if (this.input.activePointer.isDown) {
		// 	this.game.state.start('mainMenuState');
		// };
	},

	startClouds: function () {
		var rate = Math.floor(Math.random() * 100) + 100;
		this.cloud = this.clouds.create(600, 15, 'cloud');
		this.cloud.body.velocity.x = -rate;
		if (this.cloud.inWorld == false) {
			this.cloud.kill;
		};
	},

	startGround: function () {
		this.ground = this.grounds.create(600, 575, 'ground');
		this.ground.body.velocity.x = -200;
		if (this.ground.inWorld == false) {
			this.ground.kill;
		};
	},

	actionOnClick: function() {
	// background.visible =! background.visible;
		this.game.state.start('mainMenuState');
	}

};

//init states & start first state
game.state.add('playingState', playingState, false);
game.state.add('mainMenuState', mainMenuState, false);
game.state.add('startUpState', startUpState, false);
game.state.start('startUpState');
