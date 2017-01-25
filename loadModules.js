module.exports = function () {
    // Additional global constants
    _.assign(global, {
        // Creep speed descriptors. Value is ratio of MOVE parts to other parts.
        SPEED_PLAINS_1_TICK = 1,
        SPEED_ROAD_1_TICK = 0.5,
        SPEED_ROAD_2_TICKS = 0.25
    })

    Creep.Task = require('creep.task');
    Creep.BodyDef = require('creep.bodydef');
    _assign(Creep, {
        tasks: {
            dumpEnergy: require('creep.task.dumpEnergy'),
            staticMine: require('creep.task.staticMine'),
            withdrawEnergy: require('creep.task.withdrawEnergy')
        },
        behaviors: {
            hauler: require('creep.behavior.hauler'),
            staticMiner: require('creep.behavior.staticMiner')
        }
    })






    ///
    /// Creep properties
    ///
    Creep.prototype.tickSetup = function () {
        // ?
    }
    // Taken from bonzAI
    Creep.prototype.blindMoveTo = function (destination, ops, daredevil = false) {
        if (this.spawning) {
            return 0;
        }

        if (this.fatigue > 0) {
            return ERR_TIRED;
        }

        if (!this.memory.position) {
            this.memory.position = this.pos;
        }

        if (!ops) {
            ops = {};
        }

        // check if trying to move last tick
        let movingLastTick = true;
        if (!this.memory.lastTickMoving) this.memory.lastTickMoving = 0;
        if (Game.time - this.memory.lastTickMoving > 1) {
            movingLastTick = false;
        }
        this.memory.lastTickMoving = Game.time;

        // check if stuck
        let stuck = this.pos.inRangeTo(this.memory.position.x, this.memory.position.y, 0);
        this.memory.position = this.pos;
        if (stuck && movingLastTick) {
            if (!this.memory.stuckCount) this.memory.stuckCount = 0;
            this.memory.stuckCount++;
            if (dareDevil && this.memory.stuckCount > 0) {
                this.memory.detourTicks = 5;
            }
            else if (this.memory.stuckCount >= 2) {
                this.memory.detourTicks = 5;
                // this.say("excuse me", true);
            }
            if (this.memory.stuckCount > 500 && !this.memory.stuckNoted) {
                console.log(this.name, "is stuck at", this.pos, "stuckCount:", this.memory.stuckCount);
                this.memory.stuckNoted = true;
            }
        }
        else {
            this.memory.stuckCount = 0;
        }

        if (this.memory.detourTicks > 0) {
            this.memory.detourTicks--;
            if (dareDevil) {
                ops.reusePath = 0;
            }
            else {
                ops.reusePath = 5;
            }
            return this.moveTo(destination, ops);
        }
        else {
            ops.reusePath = 50;
            ops.ignoreCreeps = true;
            return this.moveTo(destination, ops);
        }
    }
    // Taken from bonzAI (and subjectively improved)
    Creep.prototype.moveItOrLoseIt = function (position) {
        if (this.fatigue > 0) { return OK; }
        if (this.pos.isNearTo(position)) {
            // Take care of creep that might be in the way
            let occupier = position.lookFor(LOOK_CREEPS)[0];
            if (occupier) {
                if (this.memory.behaviorName && occupier.memory.behaviorName) {
                    for (let resourceType in occupier.carry) {
                        occupier.transfer(this, resourceType);
                    }
                    this.say("my spot!");
                    occupier.suicide();
                }
                else {
                    let direction = occupier.pos.getDirectionTo(this);
                    occupier.move(direction);
                    this.say("move it");
                }
            }
            let direction = this.pos.getDirectionTo(position);
            return this.move(direction);
        }
        return this.blindMoveTo(position);
    }
    Object.defineProperties(Creep.prototype, {
        'taskTarget': {
            get: function () {
                if (this._taskTarget === undefined) {
                    this._taskTarget = Game.getObjectById(this.memory.taskTargetId);
                }
                return this._taskTarget;
            },
            set: function (value) {
                this._taskTarget = value;
                this.memory.taskTargetId = value.id;
            }
        },
        'carrySum': {
            get: function () {
                if (this._carrySum === undefined) {
                    this._carrySum = _.sum(this.carry);
                }
                return this._carrySum;
            }
        },
        'spaceFree': {
            get: function () {
                if (this._spaceFree === undefined) {
                    this._spaceFree = this.carryCapacity - _.sum(this.carry);
                }
                return this._spaceFree;
            }
        },
    });


    ///
    /// Structure properties
    ///
    let spaceFreeGetter = {
        get: function () {
            if (this._spaceFree === undefined) {
                this._spaceFree = this.storeCapacity - _.sum(this.store);
            }
            return this._spaceFree;
        }
    };
    let containerEnergyGetter = {
        get: function () {
            return this.store.energy;
        }
    }
    Object.defineProperties(StructureContainer.prototype, {
        'energy': containerEnergyGetter,
        'spaceFree': spaceFreeGetter
    });
    Object.defineProperties(StructureStorage.prototype, {
        'energy': containerEnergyGetter,
        'spaceFree': spaceFreeGetter

    });
    let energySpaceFreeGetter = {
        get: function () {
            if (this._spaceFree === undefined) {
                this._spaceFree = this.energyCapacity - this.energy;
            }
            return this._spaceFree;
        }
    };
    Object.defineProperties(StructureSpawn.prototype, {
        'spaceFree': energySpaceFreeGetter
    });
    Object.defineProperties(StructureExtension.prototype, {
        'spaceFree': energySpaceFreeGetter
    });
    Object.defineProperties(StructureTower.prototype, {
        'spaceFree': energySpaceFreeGetter
    });
    Object.defineProperties(StructureLink.prototype, {
        'spaceFree': energySpaceFreeGetter
    });


    ///
    /// RoomPosition properties
    ///
    RoomPosition.prototype.getPositionAtDirection = function (direction) {
        let x = this.x;
        let y = this.y;

        if (direction === 1) {
            y -= 1;
        }
        else if (direction === 2) {
            y -= 1;
            x += 1;
        }
        else if (direction === 3) {
            x += 1;
        }
        else if (direction === 4) {
            x += 1;
            y += 1;
        }
        else if (direction === 5) {
            y += 1;
        }
        else if (direction === 6) {
            y += 1;
            x -= 1;
        }
        else if (direction === 7) {
            x -= 1;
        }
        else if (direction === 8) {
            x -= 1;
            y -= 1;
        }
        return new RoomPosition(x, y, this.roomName);
    };
    RoomPosition.prototype.getPosFromMem = function (memPos) {
        return new RoomPosition(memPos.x, memPos.y, memPos.room);
    }
}