let Mission = require('mission');
// GuardMission sends a creep to fend off NPC invaders in a room.
class GuardMission extends Mission {
    constructor(operation) {
        let missionName = operation.operationName + "(" + MISSION_GUARD + ")";
        super(operation, missionName);
        this.idlePosition = new RoomPosition(25,25,this.roomName);
    }
    initMission() {
        this.spawn = this.operation.findSpawn();
    }
    headCount() {
        let guardsNeeded = 0;
        if (this.memory.lastSeenHostile === undefined) {
            this.memory.lastSeenHostile = 1;
        }
        if (Game.rooms[this.roomName].hostiles.length > 0) {
            this.memory.lastSeenHostile = Game.time;
            guardsNeeded = 1;
        }
        if (Game.time - this.memory.lastSeenHostile > 3000) {
            guardsNeeded = 1;
        }
        this.guards = this.getMissionCreeps("guard", guardsNeeded, Creep.BodyDef.guard, { rcl: 8 });
    }
    actions() {
        for (let creep of this.guards) {
            Creep.behaviors.guard.run(creep, this);
        }
    }
}
module.exports = GuardMission;