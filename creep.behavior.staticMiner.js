/*
staticMiner: Creep is assigned a source (can be in a different room). Moves
to the source and mines it forever. Drops energy, preferably into a given container.
*/
class StaticMiner {
    // The findTask function can assume that all the state necessary for determining the next task has been assigned in assignBehavior
    run(creep, mission) {
        let source = mission.source;
        let container = mission.container;
        if (creep.pos.isEqualTo(container)) { // Mine
            if ((source.energy === 0 || container.hits < 200000)) { // TODO: repair logic is pretty ugly
                if (creep.carry.energy > 5) {
                    creep.repair(container);
                }
                else if (container.getStoredAmount(RESOURCE_ENERGY) > 50) {
                    creep.withdraw(container, RESOURCE_ENERGY);
                }
                else {
                    creep.harvest(source);
                }
            }
            else if (source.energy > 0) {
                creep.harvest(source);
            }
        }
        else { // Move to container
            creep.moveItOrLoseIt(container.pos);
        }
    }
}
module.exports = StaticMiner;