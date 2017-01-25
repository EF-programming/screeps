let mod = {};
module.exports = mod;
/*
withdrawEnergy: Withdraws energy from a structure that can contain energy.
Memory fields used:
creep.taskTarget: the structure
*/
mod.taskName = 'withdrawEnergy';
mod.isStillValid = function (creep, structure) {
    if (structure === undefined) { // If structure is not passed as an arg, get it from the creep's target.
        if (creep.taskTarget === undefined) {
            return false;
        }
        structure = creep.taskTarget;
    }
    if (structure.energy > 0) {
        return true;
    }
    return false;
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