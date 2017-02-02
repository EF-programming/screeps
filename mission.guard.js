let Mission = require('mission');
// GuardMission sends a creep to fend off NPC invaders in a room.
class GuardMission extends Mission {
    constructor(operation) {
        let missionName = operation.operationName + "(" + MISSION_GUARD + ")";
        super(operation, missionName);
        this.idlePosition = Game.rooms[this.roomName].find(FIND_SOURCES)[1].pos;
    }
    initMission() {
        this.spawn = this.operation.findSpawn();
    }
    headCount() {
        this.guards = this.getMissionCreeps("guard", 1, Creep.BodyDef.guard, { rcl: 8 });
    }
    actions() {
        for (let creep of this.guards) {
            Creep.behaviors.guard.run(creep, this);
        }
    }
}
module.exports = GuardMission;