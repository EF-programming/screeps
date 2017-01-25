let mod = {};
module.exports = mod;
/*
travel: Creep moves to a position in a different room.
Memory fields used:
creep.memory.taskTargetPos: target position
*/
mod.taskName = 'travel';
mod.isStillValid = function (creep) {
    if (creep.room.name === creep.memory.taskTargetPos.roomName) {
        return false;
    }
    return true;
}
mod.assignTask = function (creep, targetPos) {
    creep.memory.taskName = taskName;
    creep.memory.taskTargetPos = targetPos;
}
mod.doTask = function (creep) {
    creep.blindMoveTo(creep.memory.taskTargetPos);
    return creep.room.name === creep.memory.taskTargetPos.roomName;
}