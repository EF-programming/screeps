let actionPickUpEnergy = require('creep.action.pickUpEnergy');

let mod = {};
module.exports = mod;
mod.assignBehavior = function() { }

mod.run = function (creep) {
    // assign containers and other state (or should that be outside)
    
    if (creep.memory.pickingUp) {
        if (!creep.pos.isNearTo(creep.memory.pickupContainer)) { // Move to container
            creep.moveTo(creep.memory.pickupContainer);
        }
        else { // Pick up energy
            creep.withdraw(creep.memory.pickupContainer);
        }
    }
    if (creep.memory.reachedSource) { // Mining procedure
        if (creep.carry.energy == creep.carryCapacity) {
            //creep.drop(RESOURCE_ENERGY);
            creep.transfer(creep.memory.assignedContainer, RESOURCE_ENERGY);
        }
        creep.harvest(assignedSource);
    }
    else { // Walk to source
        creep.moveTo(creep.memory.assignedSource);
        if (creep.pos.isNearTo(creep.memory.assignedSource)) {
            creep.memory.reachedSource = true;
            container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (x) =>
                    x.structureType == STRUCTURE_CONTAINER &&
                    x.store[RESOURCE_ENERGY] < x.storeCapacity
            });
            creep.memory.assignedContainer = container;
        }
    }
}