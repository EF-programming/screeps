let mod = {};
module.exports = mod;
/*
withdrawEnergy: Withdraws energy from a structure.
Memory fields used:
creep.taskTarget: the structure
*/
mod.taskName = 'withdrawEnergy';
mod.isStillValid = function (creep) {
    if (creep.taskTarget === undefined) {
        return false;
    }
    structure = creep.taskTarget;
    if (structure.energy === 0) {
        return false;
    }
    return true;
}
mod.assignTask = function (creep, structure) {
    creep.memory.taskName = taskName;
    creep.taskTarget = structure;
}
mod.doTask = function (creep) {
    if (creep.withdraw(creep.taskTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.taskTarget);
        return false;
    }
    return true;
}