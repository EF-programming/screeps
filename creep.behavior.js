class Behavior {
    // Avoids dangerous rooms by moving to the spawn room, then idling offroad.
    avoidDangerRooms(creep, mission) {
        if ((mission.dangerPeriod && creep.room.name !== mission.roomName) ||
            (creep.room.dangerPeriod && creep.room.name === mission.spawn.room.name)) {
            if (creep.isNearExit(2)) {
                creep.blindMoveTo(mission.spawn.pos);
                return true;
            }
            else {
                creep.moveOffRoad();
                return true;
            }
        }
        // Does not work well if there is a dangerous room between the mission room and the spawn room (will move back and forth on the edge)
        else if (creep.room.dangerPeriod) { 
            creep.blindMoveTo(mission.spawn.pos);
            return true;
        }
        return false;
    }
}
module.exports = Behavior;