let mod = {};
module.exports = mod;
/*
upgrade: Creep moves to the room's controller and upgrades it.
Memory fields used: none
*/
mod.taskName = 'upgrade';
mod.isStillValid = function (creep) { // Used only on subsequent ticks of the task? (basically after assignTask has been done)?
    if (creep.carry.energy === 0) {
        return false;
    }
    if (creep.getActiveBodyparts(WORK) === 0) {
        return false;
    }
    return true;
}
mod.assignTask = function (creep) {
    creep.memory.taskName = taskName;
}
mod.doTask = function (creep) {
    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.blindMoveTo(creep.room.controller);
    }
    else { // if we successfully upgrade this tick, check if the inventory empty
        if (creep.carry.energy - creep.getActiveBodyparts(WORK) <= 0) {
            creep.meleeActionDone = true;
            creep.rangedActionDone = true;
            return true;
        }
    }
    return false;
}