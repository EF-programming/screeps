// Currently not used.
class Behavior {
    run = function (creep) {
        if (!creep.memory.taskName || !Creep.tasks[creep.memory.taskName].isStillValid(creep)) {
            this.findTask(creep);
        }
        this.doTask(creep);
    }
    doTask(creep) {
        let taskFinished = Creep.tasks[creep.memory.taskName].doTask(creep);
        if (taskFinished) {
            this.findTask(creep);
            this.doTask(creep);
        }
    }
}
modules.exports = Behavior;