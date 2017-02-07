let Behavior = require('creep.behavior');
/*
reserver: Creep goes to a room and reserves the controller.
*/
class Reserver extends Behavior {
    run(creep, mission) {
        if (this.avoidDangerRooms(creep, mission)) { return; }
        if (creep.room.name !== mission.roomName) {
            let destination;
            if (mission.hasVision) {
                destination = mission.room.controller.pos;
            }
            else {
                destination = mission.flag.pos;
            }
            creep.blindMoveTo(destination);
            return;
        }
        // In the same room as the controller
        if (creep.pos.isNearTo(creep.room.controller)) {
            creep.moveOffRoad(creep.room.controller.pos);
            creep.reserveController(creep.room.controller);
        }
        else {
            creep.blindMoveTo(creep.room.controller, { maxRooms: 1 });
        }
    }
}
module.exports = Reserver;