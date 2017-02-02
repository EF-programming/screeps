let mod = {};
module.exports = mod;
mod.initPrototype = function () {
    Creep.prototype.isFull = function () {
        return _.sum(this.carry) === this.carryCapacity;
    }
    // resourceType arg is optional.
    Creep.prototype.getStoredAmount = function (resourceType) {
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
            if (daredevil && this.memory.stuckCount > 0) {
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
            if (daredevil) {
                ops.reusePath = 0;
            }
            else {
                ops.reusePath = 5;
            }
            return this.moveTo(destination, ops);
        }
        else {
            ops.reusePath = 200;
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
                if (this.memory.roleName === occupier.memory.roleName) {
                    for (let resourceType in occupier.carry) { // This actually only transfers one resource type because only one transfer can be done per tick. But we don't know which resource the creep is holding, hence the for loop.
                        occupier.transfer(this, resourceType);
                    }
                    //this.say("my spot!");
                    occupier.suicide();
                }
                else {
                    let direction = occupier.pos.getDirectionTo(this);
                    occupier.move(direction);
                    //this.say("move it");
                }
            }
            let direction = this.pos.getDirectionTo(position);
            return this.move(direction);
        }
        else {
            return this.blindMoveTo(position);
        }
    }
    // Taken from bonzAI
    Creep.prototype.idleNear = function (pos, desiredRange = 3) {
        let range = this.pos.getRangeTo(pos);

        if (range < desiredRange) {
            this.moveOffRoad();
        }
        else if (range === desiredRange) {
            this.moveOffRoad(pos, true);
        }
        else {
            this.blindMoveTo(pos);
        }
    }
    // Taken from bonzAI (changed to make maintainDistance=false not favor closer spots)
    // Creep immediately moves off the road. Regardless of the distance to targetPos, the creep moves off the road and if successful, the goal is accomplished.
    // targetPos is the tile near which the creep should idle. Optional, if not passed will use own pos.
    // maintainDistance=true means the chosen idle position will be within the same range or less.
    // targetPos and maintainDistance act as a pair, either pass neither (simply move off the road), or
    // pass both (move off the road while maintaining distance to target)
    Creep.prototype.moveOffRoad = function (targetPos = this.pos, maintainDistance = false) {
        let offRoad = this.pos.lookForStructure(STRUCTURE_ROAD) === undefined;
        if (offRoad) return OK;

        let positions = this.pos.openAdjacentSpots();
        if (maintainDistance) {
            let currentRange = this.pos.getRangeTo(targetPos);
            positions = _.filter(positions, p => p.getRangeTo(targetPos) <= currentRange);
        }
        let swampPosition;
        for (let position of positions) { // Picks the first "plains" found, otherwise picks "swamp", otherwise blindMoves to targetPos.
            if (position.lookForStructure(STRUCTURE_ROAD)) continue;
            let terrain = position.lookFor(LOOK_TERRAIN)[0];
            if (terrain === "swamp") {
                swampPosition = position;
            }
            else {
                return this.move(this.pos.getDirectionTo(position));
            }
        }

        if (swampPosition) {
            return this.move(this.pos.getDirectionTo(swampPosition));
        }

        return this.blindMoveTo(targetPos);
    };
    Object.defineProperties(Creep.prototype, {
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