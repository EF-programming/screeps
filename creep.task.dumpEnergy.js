let mod = {};
module.exports = mod;
/*
storeEnergy: Stores energy in a structure that can contain energy.
Memory fields used:
creep.taskTarget: the structure
*/
mod.taskName = 'dumpEnergy';
mod.isStillValid = function (creep, structure) { // if structure arg is not passed, it is retrieved from creep.taskTarget
    if (structure === undefined) {
        if (creep.taskTarget === undefined) {
            return false;
        }
        structure = creep.taskTarget;
    }
    if (structure.spaceFree > 0 || structure.energyCapacity - structure.energy > 0) { // The || case is for labs
        return true;
    }
    return false;
}
mod.assignTask = function (creep, structure) {
    creep.memory.taskName = taskName;
    creep.taskTarget = structure;
}
mod.doTask = function (creep) {
    if (creep.transfer(creep.taskTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.taskTarget);
        return false;
    }
    return true;
}