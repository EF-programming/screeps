let mod = {};
module.exports = mod;
/*
staticMine: Creep moves to a given source. When at the source, mines 
and drops energy into a container. Repairs the container.
Memory fields used:
creep.memory.containerId: container id
creep.taskTarget / creep.memory.taskTargetId: target source / target source id
*/
mod.taskName = 'staticMine';
mod.isStillValid = function (creep) { // Used only on subsequent ticks of the task? (basically after assignTask has been done)?

    return true;
}
mod.assignTask = function (creep, source, container) {
    creep.memory.taskName = taskName;
    creep.taskTarget = source;
    creep.memory.containerId = container.id;
}
mod.doTask = function (creep) {
    let container = Game.getObjectById(creep.memory.containerId);
    if (creep.pos.isNearTo(creep.taskTarget)) { // Mining procedure
        if (container && container.hitsMax - container.hits >= 500) {
            creep.repair(container);
        }
        // depositing is an instant task soooo.... move the container away


        // if (creep.carry.energy === creep.carryCapacity) {
        //     let container = Game.getObjectById(creep.memory.containerId);
        //     if (container !== undefined) {
        //         creep.transfer(container, RESOURCE_ENERGY);
        //     }
        // }
        creep.harvest(creep.taskTarget);
    }
    else { // Walk to source
        if (container) {
            creep.moveItOrLoseIt(container.pos);
        }
        else { // If there is no container
            if (creep.pos.inRangeTo(creep.taskTarget, 2)) { // When there is one tile between creep and source
                let dir = getDirectionTo(creep.taskTarget);
                targetPos = creep.pos.getPositionAtDirection(dir);
                creep.moveItOrLoseIt(targetPos);
            }
            else {
                creep.blindMoveTo(creep.taskTarget.pos);
            }
        }
    }
    return false;
}