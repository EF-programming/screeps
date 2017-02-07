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
        this.addMission(new ReserveMission(this));
        if (!this.hasVision || (!this.flag.room.controller || !this.flag.room.controller.my)) {
            this.addMission(new GuardMission(this)); // if room isn't owned by you
        }
        if (this.hasVision) {
            this.sources = this.flag.room.find(FIND_SOURCES);
            if (!this.memory.sourcePos) {
                this.memory.sourcePos = [];
                for (let source of this.sources) {
                    this.memory.sourcePos.push(source.pos);
                }
            }
            for (let source of this.sources) {
                this.addMission(new MiningMission(this, source.pos));
            }
        }
        else if (this.memory.sourcePos) {
            for (let pos of this.memory.sourcePos) {
                this.addMission(new MiningMission(this, deserializeRoomPos(pos)));
            }
        }
    }
}
MiningOperation.operationTypeName = OPERATION_MINING;
module.exports = MiningOperation;