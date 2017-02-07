let Behavior = require('creep.behavior');
/*
hauler: Creep moves to a container to take energy from it, then moves to a different
container or storage to deposit that energy.
*/
class Hauler extends Behavior {
    run(creep, mission) {
        if (creep.carry.energy === 0) { // If creep has no energy, move near container, and wait until the container contains enough to fill the creep's inventory, then withdraw.
            if (this.avoidDangerRooms(creep, mission)) { return; }
            if (!mission.hasVision) { 
                creep.moveOffRoad();
                return; 
            }
            let container = mission.container;
            if (creep.pos.isNearTo(container)) {
                if (creep.ticksToLive < mission.memory.analysis.distance) { // If haulers are programmed to pick up dropped energy, this isn't needed.
                    creep.suicide();
                    return;
                }
                if (container.getStoredAmount(RESOURCE_ENERGY) > creep.carryCapacity - creep.getStoredAmount()) {
                    creep.withdraw(container, RESOURCE_ENERGY);
                    creep.blindMoveTo(mission.storage);
                }
                else {
                    creep.moveOffRoad(container);
                }
            }
            else {
                creep.blindMoveTo(container);
            }
        }
        else { // Creep has energy.
            let storage = mission.storage;
            if (creep.pos.isNearTo(storage)) {
                creep.transfer(storage, RESOURCE_ENERGY);
                if (!mission.hasVision) {
                    return;
                }
                if (creep.ticksToLive < mission.memory.analysis.distance * 2 + 5) {
                    creep.suicide();                // TODO: change this to recycle
                }
                else {
                    creep.blindMoveTo(mission.container);
                }
            }
            else {
                this.repairUnderfoot(creep);
                creep.blindMoveTo(storage); // If hauler has 1 ticks to live, it should register a note to pick up the energy
            }
        }
    }
}
module.exports = Hauler;