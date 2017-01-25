let mod = {};
module.exports = mod;
mod.behaviorName = 'hauler';
mod.assignBehavior = function (creep, pickupContainerPos, dumpContainerPos) {
    creep.memory.behaviorName = behaviorName;
    creep.memory.pickupContainerPos = pickupContainerPos;
    creep.memory.dumpContainerPos = dumpContainerPos;
}
mod.run = function (creep) {
    if (creep.memory.taskName === 'idle' || !Creep.tasks[creep.memory.taskName].isStillValid(creep)) {
        findTask(creep);
    }
    let taskFinished = Creep.tasks[creep.memory.taskName].doTask(creep);
    if (taskFinished) {
        creep.memory.taskName = 'idle';
    }
}
mod.findTask = function (creep) {
    let needToDumpEnergy = creep.carry.energy > 0;
    let targetPos;
    if (needToDumpEnergy) {
        targetPos = RoomPosition.getPosFromMem(creep.memory.dumpContainerPos);
    }
    else {
        targetPos = RoomPosition.getPosFromMem(creep.memory.pickupContainerPos);
    }
    if (creep.room.name !== targetPos.roomName) {
        Creep.tasks.travel.assignTask(creep, targetPos);
    }
    else {
        if (needToDumpEnergy) {
            Creep.tasks.dumpEnergy.assignTask(creep, targetPos);
        }
        else {
            Creep.tasks.pickupEnergy.assignTask(creep, targetPos);
        }
    }
}