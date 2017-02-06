// creep names should be guard_mining@E34N56_guard . First guard is the creep role, 2nd guard is the mission type
// miner235_mining@E56N65(mining343)
class Operation {
    // flag: flag
    // operationTypeName: string constant that comes from the class extending Operation.
    constructor(flag, operationTypeName) {
        this.flag = flag;
        this.roomName = flag.pos.roomName;
        this.operationName = flag.name; // operationName is a unique name in the format of "operationTypeName" + "@" + "roomName"
        this.operationTypeName = operationTypeName;
        this.memory = flag.memory;
        this.missions = [];
        this.hasVision = flag.room ? true : false; // .room is undefined when no vision.
        if (this.hasVision) {
            this.room = flag.room;
        }
    }
    init() {
        try {
            this.initOperation();
        }
        catch (e) {
            console.log(`Error caught in iniOperation, operation: ${this.operationName}`);
            console.log(e.stack);
        }
        for (let mission of this.missions) {
            try {
                mission.initMission();
            }
            catch (e) {
                console.log(`Error caught in initMission, operation: ${this.operationName}, mission: ${mission.missionName}`);
                console.log(e.stack);
            }
        }
    }
    // Find creeps belonging to missions and spawn any additional needed.
    headCount() {
        // Check whether it's better to let each mission's headcount iterate all of Game.creeps or
        // to first find all creeps for this operation and cache them, and let missions iterate that.
        for (let mission of this.missions) {
            try {
                mission.headCount();
            }
            catch (e) {
                console.log(`Error caught in headCount, operation: ${this.operationName}, mission: ${mission.missionName}`);
                console.log(e.stack);
            }
        }
    }
    actions() {
        for (let mission of this.missions) {
            try {
                mission.actions();
            }
            catch (e) {
                console.log(`Error caught in missionActions, operation: ${this.operationName}, mission: ${mission.missionName}`);
                console.log(e.stack);
            }
        }
    }
    finalize() {
        for (let mission of this.missions) {
            try {
                mission.finalizeMission();
            }
            catch (e) {
                console.log(`Error caught in finalizeMission, operation: ${this.operationName}, mission: ${mission.missionName}`);
                console.log(e.stack);
            }
        }
    }
    addMission(mission) {
        this.missions.push(mission);
    }
    findSpawn(maxDistance = 3) {
        // temporarily hardcoded
        let room = Game.flags[this.roomName].room;
        return room.find(FIND_STRUCTURES, { filter: x => x.structureType === STRUCTURE_SPAWN })[0];
        //////// not-hardcoded unfinished below
        let closestDistance = Number.MAX_VALUE;
        let closeRoomNames = [];
        for (let roomName in Game.rooms) {
            linearDistance = Game.map.getRoomLinearDistance(this.roomName, roomName);
            if (linearDistance > maxDistance || linearDistance > closestDistance) {
                continue;
            }
            if (linearDistance <= closestDistance) {
                if (Game.rooms[roomName].controller.my && Game.rooms[roomName].controller.level >= 3) {
                    if (linearDistance < closestDistance) {
                        closestDistance = linearDistance;
                        closeRoomNames = [roomName];
                    }
                    else {
                        closeRoomNames.push(roomName);
                    }
                }
            }
        }
    }
}
module.exports = Operation;
