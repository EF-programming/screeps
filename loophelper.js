let MiningOperation = require('operation.mining');
let mod = {};
module.exports = mod;
mod.initMemory = function () {
    if (!Memory.empire) {
        Memory.empire = {};
    }
    for (let roomName in Game.rooms) {
        if (!Memory.empire[roomName]) {
            Memory.empire[roomName] = {};
        }
    }
}
mod.scanHostiles = function () {
    if (everyXTicks(5, 0)) { // Every 5 ticks, scan for hostiles
        for (let roomName in Game.rooms) {
            let room = Game.rooms[roomName];
            if (room.hostiles.length > 0) {
                Memory.empire[roomName].danger = {};
                Memory.empire[roomName].danger.hostileCount = room.hostiles.length; // maybe replace with threat level
                Memory.empire[roomName].danger.period = Game.time + room.hostiles[0].ticksToLive;
                // some system should analyze the danger level and mark it as salvageable or unsalvageable. If it's unsalvageable, certain mission creeps should go recycle themselves if their ttl is too low.
            }
            else {
                if (Memory.empire[roomName].danger) {
                    delete Memory.empire[roomName].danger;
                }
            }
        }
    }
    if (everyXTicks(100, 0)) { // Every 100 ticks, remove .danger object if it expired
        for (let roomName in Memory.empire) {
            if ((Memory.empire[roomName].danger || {}).period) {
                if (Memory.empire[roomName].danger.period > Game.time) {
                    delete Memory.empire[roomName.danger];
                }
            }
        }
    }
}
mod.getOperations = function () {
    // opClass is the Class of the operation.
    function instantiateOperation(opClass, flag) {
        let operation;
        let operationName;
        if (flag.name.startsWith(opClass.operationTypeName)) { // Existing operation
            return new opClass(flag);
        }
        else if (flag.name.startsWith("Flag")) { // Newly placed operation, create a name for it.
            operationName = opClass.operationTypeName + "@" + flag.pos.roomName;
            let newFlagPos = new RoomPosition(flag.pos.x, flag.pos.y, flag.pos.roomName);
            newFlagPos.createFlag(operationName, flag.color, flag.flagSecondaryColor);
            flag.remove();
            return undefined; // Wait 1 tick for the new flag to be created.
        }
        else { // This flag is unrelated to an operation.
            return undefined;
        }
    }

    let operations = [];
    for (let flagName in Game.flags) {
        let operation;
        let flag = Game.flags[flagName];
        switch (flag.color) {
            case COLOR_YELLOW:
                operation = instantiateOperation(MiningOperation, flag);
                break;
            case COLOR_RED:
            case COLOR_PURPLE:
            case COLOR_BLUE:
            case COLOR_CYAN:
            case COLOR_GREEN:
            case COLOR_ORANGE:
                //operation = instantiateOperation(MaintenanceOperation, flag);
                break;
            case COLOR_BROWN:
            case COLOR_GREY:
            case COLOR_WHITE:
        }
        if (operation) {
            operations.push(operation);
        }
    }
    return operations;
}