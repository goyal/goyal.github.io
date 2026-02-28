var compounds = new Array();

var Compound = function(id, moleculeCount, facingRight, velocity) {
	this.id = id;
	this.sprite = getContentById(id);
	this.sprite.width = this.sprite.width;
	this.sprite.height = this.sprite.height;
	this.positionX = (facingRight) ? -this.sprite.width / 2 : (canvas.width + this.sprite.width / 2);
	this.positionY = Math.floor(Math.random() * (canvas.height - this.sprite.height)) + this.sprite.height;
	this.strength = 1; //Math.floor(Math.random() * MAX_COMPOUND_STRENGTH) + 1;	//assigns random strength within the range 1 to 4
	this.dead = false;
	this.disintegrated = false;
	this.moleculeCount = moleculeCount;
	this.molecules = new Array();
	this.facingRight = facingRight;
	this.velocity = velocity;
	
	this.update = function() {
		//check if hit
		if(this.disintegrated) {
			if(this.isAllMoleculesDead())
				this.destroy();
			else
				this.updateMolecules();	
		}
		else {
			if(this.facingRight)
				this.updateRight();
			else
				this.updateLeft();
		}
	}
	
	this.updateRight = function() {
		this.positionX += this.velocity;
		if(this.positionX > canvas.width + this.sprite.width)
			this.destroy();
	}
	
	this.updateLeft = function() {
		this.positionX -= this.velocity;
		if(this.positionX < -this.sprite.width)
			this.destroy();
	}
	
	this.updateMolecules = function() {	//free fall
		for(var idx = 0; idx < this.molecules.length; idx++) {
				if(!this.molecules[idx].isDead())
					this.molecules[idx].applyFreefall();
			}
	}
	
	this.isAllMoleculesDead = function() {
		for(var idx = 0; idx < this.molecules.length; idx++) {
			if(!this.molecules[idx].isDead())
				return false;
		}
		return true;
	}
	
	this.draw = function() {
		context.save();	//save the current state of the context
		if(!this.disintegrated) {
			//draw the main panel
			context.translate(this.positionX, this.positionY);
			context.drawImage(this.sprite, -this.sprite.width / 2, -this.sprite.height / 2, this.sprite.width, this.sprite.height);
		}
		else {
			//draw the children
			for(var idx = 0; idx < this.molecules.length; idx++) {
				var molecule = this.molecules[idx];
				context.translate(molecule.centerX, molecule.centerY);
				context.drawImage(molecule.sprite, -molecule.sprite.width / 2, -molecule.sprite.height / 2, molecule.sprite.width, molecule.sprite.height);
				context.translate(-molecule.centerX, -molecule.centerY);
			}
		}
		context.restore();	//restore to the previous state
	}
	
	this.handleMouseClick = function(mouseX, mouseY) {
		//check if the sprite intersects with the mouse position
		if((mouseX > this.positionX - this.sprite.width / 2 && mouseX < this.positionX + this.sprite.width / 2) && (mouseY > this.positionY - this.sprite.height / 2 && mouseY < this.positionY + this.sprite.height / 2)) {
			--this.strength;
			if(this.strength <= 0) {
				this.disintegrate();
			}	
		}
	}
	
	this.disintegrate = function() {
		if(this.disintegrated) return;
		
		this.disintegrated = true;
		var angle_step = 360 / this.moleculeCount;
		var coords = new Array(this.positionX - (this.sprite.width / 2) - MAX_DISPLACEMENT, this.positionY - (this.sprite.height / 2) - MAX_DISPLACEMENT,
							   this.positionX + MAX_DISPLACEMENT, this.positionY - (this.sprite.height / 2) - MAX_DISPLACEMENT,
							   this.positionX - (this.sprite.width / 2) - MAX_DISPLACEMENT, this.positionY + MAX_DISPLACEMENT,
							   this.positionX + MAX_DISPLACEMENT, this.positionY + MAX_DISPLACEMENT
							  );
		for(var i = 0; i < this.moleculeCount; i++) {
			var centerX = coords[2 * i];
			var centerY = coords[(2 * i) + 1];
			this.molecules[i] = new Molecule(getSubContentById(this.id), centerX, centerY);
		}
	}
	
	this.destroy = function() {
		this.dead = true;
	}
	
	this.isDead = function() {
		return this.dead;	
	}
}

var Molecule = function(sprite, centerX, centerY) {
	this.sprite = sprite;
	this.sprite.width = sprite.width;
	this.sprite.height = sprite.height;
	this.centerX = centerX;
	this.centerY = centerY;
	this.dead = false;
	this.freeFallElapsedTime = 0;
	
	this.applyFreefall = function() {
		if(this.dead) return;
		
		this.freeFallElapsedTime += UPDATE_TIME_MS;
		var displacement = (0.5) * GRAVITY * Math.pow(this.freeFallElapsedTime / 1000, 2);
		this.centerY += displacement;
		
		if(this.freeFallElapsedTime > TTL)
			this.destroy();
	}
	
	this.currentY = function() {
		return this.centerY;
	}
	
	this.destroy = function() {
		this.dead = true;
	}
	
	this.isDead = function() {
		return this.dead;
	}
}

var CompoundSpawnLogic = function() {
	this.frameCount = 0;
	
	this.run = function() {
		if(!this.isReadyToSpawn()) return;
		
		var aliveRate = compounds.length / MAX_POPULATION;
		var spawnChance = 1 - aliveRate;
		var spawnCount = SPAWN_LIMIT * spawnChance;
		//limit compounds to MAX_POPULATION
		if(compounds.length + spawnCount > MAX_POPULATION)
			spawnCount = MAX_POPULATION - compounds.length;
			 
		for(var idx = 0; idx < spawnCount; idx++) {
			var direction = ((Math.floor(Math.random() * 100) + 1) % 2 == 0);
			var cId = Math.floor(Math.random() * totalCompounds);
			compounds[compounds.length] = new Compound(cId, 4, direction, MAX_VELOCITY);
		}
		this.frameCount = 0;
	}
	
	this.isReadyToSpawn = function() {
		++this.frameCount;
		return (this.frameCount >= UPDATE_POPULATION_AT_FRAME);
	}
}

function updateCompounds()
{
	removeDeadCompounds();
	
	compoundSpawnLogic.run();
	
	for(var idx = 0; idx < compounds.length; idx++) {
		compounds[idx].update();	
	}
}

function drawCompounds()
{
	for(var idx = 0; idx < compounds.length; idx++) {
		compounds[idx].draw();	
	}
}

function onCanvasMouseMove(e)
{
	for(var idx = 0; idx < compounds.length; idx++) {
		compounds[idx].handleMouseClick(e.clientX, e.clientY);	
	}	
}

function removeDeadCompounds()
{
	var aliveCompounds = new Array();
	var count = 0;
	for(var idx = 0; idx < compounds.length; idx++) {
		if(!compounds[idx].isDead())
			aliveCompounds[count++] = compounds[idx];
	}
	
	compounds = aliveCompounds;
}