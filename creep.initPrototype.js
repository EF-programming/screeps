let mod = {};
module.exports = mod;
mod.initPrototype = function () {
    Creep.prototype.isFull = function () {
        return _.sum(this.carry) === this.carryCapacity;
    }
    // resourceType arg is optional.
    Structure.prototype.getStoredAmount = function (resourceType) {
        if (resourceType === undefined) {
            return _.sum(this.store);
        }
        else {
            return target.store[resourceType];
        }
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
        taskTarget: {
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
        spaceFree: {
            get: function () {
                if (this._spaceFree === undefined) {
                    this._spaceFree = this.carryCapacity - _.sum(this.carry);
                }
                return this._spaceFree;
            }
        },
    });
}