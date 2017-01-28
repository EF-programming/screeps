let mod = {};
module.exports = mod;
/*
storeEnergy: Stores energy in a structure that can contain energy.
Memory fields used:
creep.taskTarget: the structure
*/
mod.taskName = 'dumpEnergy';
mod.isStillValid = function (creep) { // if structure arg is not passed, it is retrieved from creep.taskTarget
    if (creep.taskTarget === undefined) {
        return false;
    }
    structure = creep.taskTarget;
    if (isFull(structure, RESOURCE_ENERGY)) {
        return false;
    }
    return true;
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