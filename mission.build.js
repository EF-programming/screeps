let Mission = require('mission');
// BuildMission sends creeps to build construction sites in a room.
class BuildMission extends Mission {
    constructor(operation) {
        let missionName = operation.operationName + "(" + MISSION_BUILD + ")";
        super(operation, missionName);
    }
    initMission() {
        this.spawn = this.operation.findSpawn();
        if (this.hasVision) {
            if (!this.room.storage) {
                let containers = _.sortBy(this.room.findStructures(STRUCTURE_CONTAINER), x => x.getStoredAmount());
                if (containers.length > 0 && containers[0].getStoredAmount >= 100) {
                    this.container = containers[0];
                }
            }
        }
        // analyze how many builders needed
    }
    headCount() {
        this.builders = this.getMissionCreeps("builder", 1, Creep.BodyDef.worker);
    }
    actions() {
        for (let creep of this.builders) {
            Creep.behaviors.builder.run(creep, this);
        }
    }
}
module.exports = BuildMission;