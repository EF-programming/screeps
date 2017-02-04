let Operation = require('operation');
let GuardMission = require('mission.guard');
let MiningMission = require('mission.mining');
let ReserveMission = require('mission.reserve');
let ScoutMission = require('mission.scout');
class MiningOperation extends Operation {
    constructor(flag) {
        super(flag, OPERATION_MINING);
        if (this.hasVision) {
            this.sources = flag.room.find(FIND_SOURCES);
        }
    }

    initOperation() {
        if (!this.hasVision) {
            this.addMission(new ScoutMission(this));
            return;
        }
        if (this.room.hostiles > 0) { // If there are hostiles we need to halt mining operations until they're gone
            Memory.empire[this.roomName].hostiles = this.room.hostiles.length;
            Memory.empire[this.roomName].dangerPeriod = Game.time + this.room.hostiles[0].ticksToLive;
        }
        if (this.flag.room.controller && !this.flag.room.controller.my) {
            this.addMission(new ReserveMission(this));
        }
        if (!this.flag.room.controller || !this.flag.room.controller.my) {
            this.addMission(new GuardMission(this)); // if room isn't owned by you
        }
        for (let source of this.sources) {
            this.addMission(new MiningMission(this, source));
        }
    }
}
MiningOperation.operationTypeName = OPERATION_MINING;
module.exports = MiningOperation;