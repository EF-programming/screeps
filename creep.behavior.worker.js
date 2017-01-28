let mod = new Creep.Behavior();
module.exports = mod;
mod.behaviorName = 'worker';
mod.assignBehavior = function (creep) {
    creep.memory.behaviorName = behaviorName;
}
mod.findTask = function (creep) {
    // The behavior should have access to room state that helps it determine which task is worth doing
    if (creep.energy === 0) {
        // picking
        // withdrawing?
        let taskPriorities = [
            Creep.tasks.harvest
        ]
    }
    else { // These tasks can be started with a very low amount of energy which is inefficient.
        let taskPriorities = [
            Creep.tasks.fuel,
            Creep.tasks.repair,
            Creep.tasks.build,
            Creep.tasks.upgrade
        ]
        // feeding
        // fueling
        // upgrading
    }
}