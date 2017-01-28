let mod = {};
module.exports = mod;
/*
harvest: Creep moves to a given source. Harvests from the source until max carry capacity.
Memory fields used:
creep.taskTarget / creep.memory.taskTargetId: target source / target source id
*/
mod.taskName = 'harvest';
mod.isStillValid = function (creep) { // Used only on subsequent ticks of the task? (basically after assignTask has been done)?
    if (isFull(creep, RESOURCE_ENERGY)) {
        return false;
    }
    if (creep.getActiveBodyparts(WORK) === 0) {
        return false;
    }
    // maybe check if source is depleted with more than x on refresh timer remaining.
    return true;
}
mod.assignTask = function (creep, source) {
    creep.memory.taskName = taskName;
    creep.taskTarget = source;
}
mod.doTask = function (creep) {
    // No need to check creep.meleeActionDone because harvest cannot override any another action.
    let result = creep.harvest(creep.taskTarget);
    if (result === ERR_NOT_IN_RANGE) {
        creep.blindMoveTo(creep.taskTarget.pos);
    }
    else if (result === OK) { // if we successfully harvest this tick, check if the inventory will be full
        if (creep.carry.energy + creep.getActiveBodyparts(WORK) * HARVEST_POWER >= creep.carryCapacity) {
            creep.meleeActionDone = true;
            return true;
        }
    }
    return false;
}