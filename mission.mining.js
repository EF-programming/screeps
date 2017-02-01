// MiningMission does three main things.
// 1. Send one miner to mine a source. Miner builds container at the source.
// 2. Send haulers to bring back energy mined by miner.
// 3. Make a creep build and maintain a road between the source and storage.
// If there is no vision, mining mission does not get created and none of the code in this class is executed,
// therefore we can rely on there being vision for this code.
// Member variables: source, container, storage, analysis, miners, haulers.
class MiningMission extends Mission {
    constructor(operation, source) {
        let missionName = operation.operationName + "(" + MISSION_TYPES[MINING] + perfectHashTwoInts(source.pos.x, source.pos.y) + ")";
        super(operation, missionName);
        this.source = source;
    }
    initMission() {
        if (!this.memory.spawn) {
            this.memory.spawn = this.operation.findSpawn();
        }
        this.spawn = this.memory.spawn;
        // find storage.
        // Hardcoded, assumes storage exists.
        let room = Game.flags[this.roomName].room;
        this.storage = room.storage;

        // find/place container
        this.container = this.findContainer(); // TODO: if the container doesn't exist we're screwed

        if (!this.memory.analysis) {
            this.memory.analysis = this.calculateMiningAndHaulingStats();
        }
        // maybe determine if room is too dangerous to send miners & spawn new ones. Check if any 
        // room on the way is in a state of "under assault" and do not execute the mission if so.
    }
    headCount() {
        // Maybe check if spawn is in same room as source and use that to decide the movespeed of the miner
        this.miners = this.getMissionCreeps("miner", 1, Creep.BodyDef.staticMinerRemote, { rcl: this.spawn.room.controller.level }, { prespawn: this.memory.distance });
        this.haulers = this.getMissionCreeps("hauler", this.memory.analysis.numOfHaulers, Creep.BodyDef.hauler, { [CARRY]: this.memory.analysis.carryPartsPerHauler }, { prespawn: 45 }) // Find a way to calc prespawn time better
    }
    actions() {
        for (let creep of this.miners) {
            Creep.behaviors.staticMiner.run(creep, this);
        }
        for (let creep of this.haulers) {
            Creep.behaviors.hauler.run(creep, this);
        }
    }
    findContainer() {
        for (pos in this.source.openAdjacentSpots({ ignoreCreeps: true })) {
            if (pos.lookFor(LOOK_STRUCTURES).length > 0) {
                // Stupid assumption for now.
                return pos.lookFor(LOOK_STRUCTURES)[0];
            }
        }
    }
    calculateHaulingStats() {
        let analysis = {};
        let result = PathFinder.search(this.source.pos, { goal: this.storage, range: 1 });
        analysis.distance = result.path.length;
        let minePerTick = this.source.energyCapacity / ENERGY_REGEN_TIME;
        let maxSize = Creep.BodyDef.hauler.multiCount(this.spawn.room.controller.level) + 1;
        let maxHaulPerTickPerHauler = Math.floor((maxSize * CARRY_CAPACITY) / (analysis.distance * 2));
        let numOfHaulers = Math.ceil(minePerTick / maxHaulPerTickPerHauler); // The minimum number of haulers needed to haul the energy.
        let avgHaulPerTickPerHauler = minePerTick / numOfHaulers; // Distribute the energy load evenly between haulers.
        let carryCapacityPerHauler = avgHaulPerTickPerHauler * analysis.distance * 2;
        analysis.carryPartsPerHauler = Math.ceil(carryCapacityPerHauler / CARRY_CAPACITY);
        analysis.numOfHaulers = numOfHaulers;
        return analysis;
    }
}
module.exports = MiningMission;