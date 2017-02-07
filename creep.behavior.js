class Behavior {
    // Avoids dangerous rooms by moving to the spawn room, then idling offroad.
    avoidDangerRooms(creep, mission) {
        if ((mission.dangerPeriod && creep.room.name !== mission.roomName) ||
            (creep.room.dangerPeriod && creep.room.name === mission.spawn.room.name)) {
            if (creep.pos.isNearExit(3)) {
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
    repairUnderfoot(creep) {
        let road = creep.pos.lookFor(LOOK_STRUCTURES)[0];
        if (road) {
            let flags = road.pos.lookFor(LOOK_FLAGS);
            if (flags.length === 0 || flags[0].color !== COLOR_BROWN) {
                if (road.hitsMax - road.hits >= 100) {
                    creep.repair(road);
                }
            }
        }
    }
}
module.exports = Behavior;