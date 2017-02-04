let Operation = require('operation');
let GuardMission = require('mission.guard');
class FightingOperation extends Operation {
    constructor(flag) {
        super(flag, OPERATION_MINING);
    }

    initOperation() {
        this.addMission(new GuardMission(this));
    }
}
FightingOperation.operationTypeName = OPERATION_FIGHTING;
module.exports = FightingOperation;