let mod = {};
module.exports = mod;
/*
build: Creep moves to a construction site and builds it. Task is completed when the structure is built
or when the creep runs out of energy.
Memory fields used:
creep.taskTarget / creep.memory.taskTargetId: target construction site / target construction site id
*/
mod.taskName = 'build';
mod.isStillValid = function (creep) { // Used only on subsequent ticks of the task? (basically after assignTask has been done)?
    if (creep.taskTarget === undefined) {
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
mod.assignTask = function (creep, constructionsite) {
    creep.memory.taskName = taskName;
    creep.taskTarget = constructionsite;
}
mod.doTask = function (creep) {
    let result = creep.build(creep.taskTarget);
    if (result === ERR_NOT_IN_RANGE) {
        creep.blindMoveTo(creep.taskTarget.pos);
        return false;
    }
    else if (result === OK) {// Only other error possible is ERR_NO_BODYPART which is rare.
        // Check if the creep will run out of energy this tick. Check if the structure will be built this tick.
        if ((creep.carry.energy - creep.getActiveBodyparts(WORK) * BUILD_POWER <= 0) ||
            (creep.taskTarget.progress + Math.min(creep.getActiveBodyparts(WORK), creep.carry.energy) * BUILD_POWER >= creep.taskTarget.progressTotal)) {
            creep.meleeActionDone = true;
            creep.rangedActionDone = true;
            return true;
        }
    }
    return false;
}