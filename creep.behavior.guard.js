/*
guard: Creep guards a room, fights any hostiles present.
*/
class Guard {
    run(creep, mission) {
        if (creep.room.name !== mission.idlePosition.roomName) {
            creep.blindMoveTo(mission.idlePosition);
        }
        else {
            if (creep.room.hostiles.length > 0) {
                let enemy = creep.room.hostiles[0];
                creep.moveTo(enemy);
                creep.attack(enemy);
            }
            else {
                creep.idleNear(mission.idlePosition, 5);
            }
        }
    }
}
module.exports = Guard;