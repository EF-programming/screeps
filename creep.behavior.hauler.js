/*
hauler: Creep moves to a container to take energy from it, then moves to a different
container or storage to deposit that energy.
*/
class Hauler {
    run(creep, mission) {
        if (creep.carry.energy === 0) { // If creep has no energy, move near container, and wait until the container contains enough to fill the creep's inventory, then withdraw.
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
                    creep.moveOffRoad(container, true);
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
                if (creep.ticksToLive < mission.memory.analysis.distance * 2 + 5) {
                    creep.suicide();                // TODO: change this to recycle
                }
                else {
                    // If hauler has 1 ticks to live, it should register a note to pick up the energy
                    creep.blindMoveTo(mission.container);
                }
            }
            else {
                this.repairUnderfoot(creep);
                creep.blindMoveTo(storage);
            }
        }
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
module.exports = Hauler;