/*
scout: Creep goes to a room and stays there to provide room vision.
*/
class Scout {
    run(creep, mission) {
        if (creep.room.name !== mission.roomName) {
            let destination = new RoomPosition(25, 25, mission.roomName);
            creep.idleNear(destination, 10);
        }
    }
}
module.exports = Scout;