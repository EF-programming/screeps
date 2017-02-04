let Mission = require('mission');
// MiningMission does three main things.
// 1. Send one miner to mine a source. Miner builds container at the source.
// 2. Send haulers to bring back energy mined by miner.
// 3. Make a creep build and maintain a road between the source and storage.
// If there is no vision, mining mission does not get created and none of the code in this class is executed,
// therefore we can rely on there being vision for this code.
// Member variables: source, container, storage, analysis, miners, haulers.
class MiningMission extends Mission {
    constructor(operation, source) {
        let missionName = operation.operationName + "(" + MISSION_MINING + perfectHashTwoInts(source.pos.x, source.pos.y) + ")";
        super(operation, missionName);
        this.source = source;
    }
    initMission() {
        this.spawn = this.operation.findSpawn();
        // find storage.
        // Hardcoded, assumes storage exists.
        let room = Game.flags[this.roomName].room;
        this.storage = room.storage;

        // find/place container
        this.container = this.findContainer(); // TODO: if the container doesn't exist we're screwed

        if (!this.memory.analysis) {
            this.memory.analysis = this.calculateHaulingStats();
        }
        this.dangerLevel = this.room.hostiles.length;
    }
    headCount() {
        let miners = 1;
        let haulers = this.memory.analysis.numOfHaulers;
        if (this.dangerLevel > 0) {
            miners = 0;
            haulers = 0;
        }
        // Maybe check if spawn is in same room as source and use that to decide the movespeed of the miner
        this.miners = this.getMissionCreeps("miner", miners, Creep.BodyDef.staticMinerRemote, { rcl: this.spawn.room.controller.level }, { prespawn: this.memory.analysis.distance });
        if (this.miners.length === 0) {
            haulers = 0;
        }
        this.haulers = this.getMissionCreeps("hauler", haulers, Creep.BodyDef.hauler, { [CARRY]: this.memory.analysis.carryPartsPerHauler - 1 }, { prespawn: 45 }) // Find a way to calc prespawn time better
    }
    actions() {
        if (this.dangerLevel > 0) {
            return;
        }
        for (let creep of this.miners) {
            Creep.behaviors.staticMiner.run(creep, this);
        }
        for (let creep of this.haulers) {
            Creep.behaviors.hauler.run(creep, this);
        }
    }
    findContainer() {
        for (let pos of this.source.pos.openAdjacentSpots({ ignoreCreeps: true })) {
            if (pos.lookFor(LOOK_STRUCTURES).length > 0) {
                // Stupid assumption for now.
                return pos.lookFor(LOOK_STRUCTURES)[0];
            }
        }
    }
    calculateHaulingStats() {
        let analysis = {};
        let result = PathFinder.search(this.source.pos, { pos: this.storage.pos, range: 1 });
        analysis.distance = result.path.length;
        let minePerTick = this.source.energyCapacity / ENERGY_REGEN_TIME;
        let maxSize = Creep.BodyDef.hauler.multiCount({ rcl: this.spawn.room.controller.level }) + 1;
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