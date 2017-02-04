let Mission = require('mission');
// GuardMission sends a creep to fend off NPC invaders in a room.
class ReserveMission extends Mission {
    constructor(operation) {
        let missionName = operation.operationName + "(" + MISSION_RESERVE + ")";
        super(operation, missionName);
    }
    initMission() {
        this.spawn = this.operation.findSpawn();
    }
    headCount() {
        let reserversNeeded = 0;
        if (!this.memory.nextReserverAt || Game.time > this.memory.nextReserverAt) {
            reserversNeeded = 1;
        }
        this.reservers = this.getMissionCreeps("reserver", reserversNeeded, Creep.BodyDef.reserver, { rcl: this.spawn.room.controller.level }, { noprespawn: true });
    }
    actions() {
        for (let creep of this.reservers) {
            Creep.behaviors.reserver.run(creep, this);
        }
    }
    finalizeMission() {
        if (this.hasVision) {
            // Sends a reserver whenever the reserve ticks on the controller are below 3000.
            if (this.room.reservation) {
                this.memory.nextReserverAt = Game.time + (this.room.controller.reservation.ticksToEnd - 3000);
            }
            else {
                this.memory.nextReserverAt = Game.time;
            }
        }
    }
}
module.exports = ReserveMission;