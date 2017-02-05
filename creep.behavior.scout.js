let Behavior = require('creep.behavior');
/*
scout: Creep goes to a room and stays there to provide room vision.
*/
class Scout extends Behavior {
    run(creep, mission) {
        let destination = new RoomPosition(25, 25, mission.roomName);
        creep.idleNear(destination, 10);
    }
}
module.exports = Scout;