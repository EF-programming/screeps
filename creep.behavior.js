let Behavior = function () {
    mod.run = function (creep) {
        if (creep.memory.taskName === 'idle' || !Creep.tasks[creep.memory.taskName].isStillValid(creep)) {
            findTask(creep);
        }
        let taskFinished = Creep.tasks[creep.memory.taskName].doTask(creep);
        if (taskFinished) {
            creep.memory.taskName = 'idle';
        }
    }
}
modules.exports = Behavior;