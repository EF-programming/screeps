let mod = {};
module.exports = mod;
mod.initPrototype = function () {
    RoomPosition.prototype.getPositionAtDirection = function (direction) {
        let x = this.x;
        let y = this.y;
        switch (direction) {
            case 1:
                y -= 1;
                break;
            case 2:
                y -= 1;
                x += 1;
                break;
            case 3:
                x += 1;
                break;
            case 4:
                x += 1;
                y += 1;
                break;
            case 5:
                y += 1;
                break;
            case 6:
                y += 1;
                x -= 1;
                break;
            case 7:
                x -= 1;
                break;
            case 8:
                x -= 1;
                y -= 1;
                break;
        }
        return new RoomPosition(x, y, this.roomName);
    }
    // Taken from bonzAI
    RoomPosition.prototype.openAdjacentSpots = function (ignoreCreeps = false) {
        let positions = [];
        for (let i = 1; i <= 8; i++) {
            let testPosition = this.getPositionAtDirection(i);

            if (testPosition.isPassable(ignoreCreeps)) {
                positions.push(testPosition);
            }
        }
        return positions;
    }
    // Taken from bonzAI
    RoomPosition.prototype.isPassable = function (ignoreCreeps = false) {
        // look for walls
        if (_.head(this.lookFor(LOOK_TERRAIN)) !== "wall") {
            // look for creeps
            if (ignoreCreeps || this.lookFor(LOOK_CREEPS).length === 0) {
                // look for impassable structures
                if (_.filter(this.lookFor(LOOK_STRUCTURES), struct => {
                    return struct.structureType !== STRUCTURE_ROAD
                        && struct.structureType !== STRUCTURE_CONTAINER
                        && struct.structureType !== STRUCTURE_RAMPART;
                }).length === 0) {
                    // passed all tests
                    return true;
                }
            }
        }
        return false;
    };
    RoomPosition.prototype.isNearExit = function (range) {
        return this.x - range <= 0 || this.x + range >= 49 || this.y - range <= 0 || this.y + range >= 49;
    };
    // structureType is a STRUCTURE_ string constant
    RoomPosition.prototype.lookForStructure = function (structureType) {
        let structures = this.lookFor(LOOK_STRUCTURES);
        return _.find(structures, x => x.structureType === structureType);
    };
}