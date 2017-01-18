var roleBuilder = require('role.builder');

var roleRepairer = {

    run: function(creep) {
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }
        
        if(creep.memory.working) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (x) => (x.hitsMax - x.hits) >= 400 && x.structureType != STRUCTURE_WALL && x.structureType != STRUCTURE_CONTAINER
            });
            if(targets.length) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else { // nothing to repair
                //creep.say('nothing2repair');
                roleBuilder.run(creep);
            }
        }
        else { // If creep is not working it needs energy
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1]);
            }
        }
    }
};

module.exports = roleRepairer;