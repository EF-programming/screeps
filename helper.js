let mod = {};
module.exports = mod;
// // Taken from bonzAI
// mod.getStoredAmount = function (target, resourceType) {
//     if (target instanceof Creep) {
//         return target.carry[resourceType];
//     }
//     else if (target.hasOwnProperty("store")) {
//         return target.store[resourceType];
//     }
//     else if (resourceType === RESOURCE_ENERGY && target.hasOwnProperty("energy")) {
//         return target.energy;
//     }
// }
// // Taken from bonzAI
// mod.getCapacity = function (target) {
//     if (target instanceof Creep) {
//         return target.carryCapacity;
//     }
//     else if (target.hasOwnProperty("store")) {
//         return target.storeCapacity;
//     }
//     else if (target.hasOwnProperty("energyCapacity")) {
//         return target.energyCapacity;
//     }
// }
// // Taken from bonzAI
// mod.isFull = function (target, resourceType) {
//     if (target instanceof Creep) {
//         return target.carry[resourceType] === target.carryCapacity;
//     }
//     else if (target.hasOwnProperty("store")) {
//         return target.store[resourceType] === target.storeCapacity;
//     }
//     else if (resourceType === RESOURCE_ENERGY && target.hasOwnProperty("energy")) {
//         return target.energy === target.energyCapacity;
//     }
// }
mod.deserializeRoomPos = function (roomPosition) {
    return new RoomPosition(roomPosition.x, roomPosition.y, roomPosition.roomName);
}
// Taken from bonzAI
mod.checkEnemy = function(username) {
    if (ALLIES[username]) {
        return false;
    }

    // // make note of non-ally, non-npc creeps. Add the parameter roomName to this function for this. 
    // if (username !== "Invader" && username !== "Source Keeper") {
    //     this.strangerDanger(username, roomName);
    // }
    return true;
}
// Used mainly to convert room coordinates into a unique number. Doesn't work for too big numbers.
// http://stackoverflow.com/a/13871379/   Szudzik's function
mod.perfectHashTwoInts = function (a, b) {
    return a >= b ? a * a + a + b : a + b * b;
}
mod.everyXTicks = function (tickFrequency, offset) {
    return Game.time % tickFrequency === offset;
}