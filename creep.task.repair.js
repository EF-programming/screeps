let mod = {};
module.exports = mod;
/*
repair: Creep moves to a structure and repairs it. Task is completed when the structure is at full health
or when the creep runs out of energy.
Memory fields used:
creep.taskTarget / creep.memory.taskTargetId: target structure / target structure id
*/
mod.taskName = 'repair';
mod.isStillValid = function (creep) { // Used only on subsequent ticks of the task? (basically after assignTask has been done)?
    if (creep.taskTarget === undefined) {
        return false;
    }
    if (creep.taskTarget.hits === creep.taskTarget.hitsMax) {
        return false;
    }
    if (creep.carry.energy === 0) {
        return false;
    }
    if (creep.getActiveBodyparts(WORK) === 0) {
        return false;
    }
    return true;
}
mod.assignTask = function (creep, structure) {
    creep.memory.taskName = taskName;
    creep.taskTarget = structure;
}
mod.doTask = function (creep) {
    let result = creep.repair(creep.taskTarget);
    if (result === ERR_NOT_IN_RANGE) {
        creep.blindMoveTo(creep.taskTarget.pos);
        return false;
    }
    else if (result === OK) {// Only other error possible is ERR_NO_BODYPART which is rare.
        // Check if the creep will run out of energy this tick. Check if the structure will be repaired this tick.
        if ((creep.carry.energy - creep.getActiveBodyparts(WORK) * REPAIR_POWER * REPAIR_COST <= 0) ||
            (creep.taskTarget.hits + Math.min(creep.getActiveBodyparts(WORK), creep.carry.energy) * REPAIR_POWER >= creep.taskTarget.hitsMax)) {
            creep.meleeActionDone = true;
            creep.rangedActionDone = true;
            return true;
        }
    }
    return false;
}