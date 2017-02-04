let Mission = require('mission');
// GuardMission sends a creep to fend off NPC invaders in a room.
class ScoutMission extends Mission {
    constructor(operation) {
        let missionName = operation.operationName + "(" + MISSION_SCOUT + ")";
        super(operation, missionName);
    }
    initMission() {
        this.spawn = this.operation.findSpawn();
    }
    headCount() {
        let scoutsNeeded = 0;
        if (!this.hasVision) {
            scoutsNeeded = 1;
        }
        this.scouts = this.getMissionCreeps("scout", scoutsNeeded, Creep.BodyDef.scout, undefined, { noprespawn: true });
    }
    actions() {
        for (let creep of this.scouts) {
            Creep.behaviors.scout.run(creep, this);
        }
    }
}
module.exports = ScoutMission;