let Behavior = require('creep.behavior');
/*
builder: Creep goes to a room and builds construction sites. Takes energy
from storage if there is one, otherwise harvests from a source.
*/
class Builder extends Behavior {
    run(creep, mission) {
        if (creep.room.name !== mission.flag.pos.roomName) {
            creep.blindMoveTo(mission.flag.pos);
            return;
        }
        if (creep.carry.energy === 0) {
            let energyStorage = findEnergyStorage();
            if (energyStorage) {

            }
            else {
                energySource = this.pos.findClosestByRange(FIND_SOURCES);
            }
            if (this.pos.isNearTo(this.room.storage)) {
                this.withdraw(this.room.storage, RESOURCE_ENERGY);
                // move to construction
                return;
            }
            else {
                this.blindMoveTo(this.room.storage);
                return;
            }
        }
    }
    findEnergyStorage() {
        if (creep.room.storage) {
            return creep.room.storage;
        }
        else if (mission.container) {
            return container;
        }
    }
    findConstruction() {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                target = creep.pos.findClosestByRange(targets);
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
    }
}
module.exports = Builder;