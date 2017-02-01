let Operation = require('operation');
let MiningMission = require('mission.mining');
class MiningOperation extends Operation {
    constructor(flag) {
        super(flag, OPERATION_MINING);
        if (this.hasVision) {
            this.sources = flag.room.find(FIND_SOURCES);
        }
    }

    initOperation() {
        if (!this.hasVision) {
        //     this.addMission(new ScoutMission(this));
            return;
        }
        //this.addMission(new GuardMission(this)); // if room isn't owned by you
        for (let source of this.sources) {
            this.addMission(new MiningMission(this, source));
        }
    }
}
MiningOperation.operationTypeName = OPERATION_MINING;
module.exports = MiningOperation;