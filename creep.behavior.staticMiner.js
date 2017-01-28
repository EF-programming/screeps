let mod = {};
module.exports = mod;
/*
staticMiner: Creep is assigned a source (can be in a different room). Moves
to the source and mines it forever. Drops energy, preferably into a given container.
Memory fields used:
creep.memory.taskTargetPos = position of the source
creep.memory.containerPos = position of the container near the source
*/
mod.behaviorName = 'staticMiner';
mod.assignBehavior = function (creep, sourcePos, containerPos) {
    creep.memory.behaviorName = behaviorName;
    creep.memory.taskTargetPos = sourcePos;
    creep.memory.containerPos = containerPos;
}
// The run function can assume that all the state necessary for the workings of the behavior has been assigned in assignBehavior
mod.run = function (creep) {
    if (creep.memory.taskName === 'idle' || !Creep.tasks[creep.memory.taskName].isStillValid(creep)) {
        findTask(creep);
    }
    let taskFinished = Creep.tasks[creep.memory.taskName].doTask(creep);
    if (taskFinished) {
        creep.memory.taskName = 'idle';
    }
}
// The findTask function can assume that all the state necessary for determining the next task has been assigned in assignBehavior
mod.findTask = function (creep) {
    let sourcePos = deserializeRoomPos(creep.memory.taskTargetPos);
    if (creep.room.name !== sourcePos.roomName) {
        Creep.tasks.travel.assignTask(creep, sourcePos);
    }
    else {
        let source = sourcePos.lookFor(LOOK_SOURCES)[0];
        let containerPos = deserializeRoomPos(creep.memory.containerPos);
        let container = sourcePos.lookFor(LOOK_STRUCTURES, {
            filter: x => { x.structureType === STRUCTURE_CONTAINER }
        })[0];
        Creep.tasks.staticMine.assignTask(creep, source, container);
    }
}