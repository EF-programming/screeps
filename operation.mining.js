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
        this.addMission(new ScoutMission(this));
        if (!this.hasVision || (!this.flag.room.controller || !this.flag.room.controller.my)) {
            this.addMission(new GuardMission(this)); // if room isn't owned by you
        }
        if (!this.hasVision) {
            return;
        }
        if (this.room.hostiles.length > 0) {
            Memory.empire[this.roomName] = {};
            Memory.empire[this.roomName].danger = {};
            Memory.empire[this.roomName].danger.hostileCount = this.room.hostiles.length; // maybe replace with threat level
            Memory.empire[this.roomName].danger.period = Game.time + this.room.hostiles[0].ticksToLive;
            // some system should analyze the danger level and mark it as salvageable or unsalvageable. If it's unsalvageable, certain mission creeps should go recycle themselves if their ttl is too low.
        }
        else if (this.room.danger) {
            delete Memory.empire[this.roomName].danger;
        }
        if (this.flag.room.controller && !this.flag.room.controller.my) {
            this.addMission(new ReserveMission(this));
        }
        for (let source of this.sources) {
            this.addMission(new MiningMission(this, source));
        }
    }
}
MiningOperation.operationTypeName = OPERATION_MINING;
module.exports = MiningOperation;