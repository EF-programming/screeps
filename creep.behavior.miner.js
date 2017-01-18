var roleMiner = {

    run: function(creep) {
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
                        x.structureType == STRUCTURE_CONTAINER
                    });
                creep.memory.assignedContainer = container;
            }
        }
    }
};

module.exports = roleMiner;