let Mission = require('mission');
// MiningMission does three main things.
// 1. Send one miner to mine a source. Miner builds container at the source.
// 2. Send haulers to bring back energy mined by miner.
// 3. Make a creep build and maintain a road between the source and storage.
// Member variables: source, container, storage, analysis, miners, haulers.
class MiningMission extends Mission {
    constructor(operation, sourcePos) {
        let missionName = operation.operationName + "(" + MISSION_MINING + perfectHashTwoInts(sourcePos.x, sourcePos.y) + ")";
        super(operation, missionName);
        if (this.hasVision) {
            this.source = sourcePos.lookFor(LOOK_SOURCES)[0];
        }
    }
    initMission() {
        this.dangerPeriod = (Memory.empire[this.roomName].danger || {}).period || 0;
        // find storage.
        // Hardcoded, assumes storage exists.
        let room = Game.flags[this.roomName].room;
        this.storage = room.storage;
        this.spawn = this.operation.findSpawn();
        if (!this.hasVision) {
            return;
        }
        // find/place container
        this.container = this.findContainer(); // TODO: if the container doesn't exist we're screwed

        if (!this.memory.analysis) {
            this.memory.analysis = this.calculateHaulingStats();
        }
    }
    headCount() {
        let miners = 0;
        let haulers = 0;
        if (!this.hasVision ||
            this.dangerPeriod > 0 ||
            this.storage.getStoredAmount() > 950000) {
            miners = 0;
            haulers = 0;
        }
        else {
            miners = 1;
            haulers = this.memory.analysis.numOfHaulers;
        }
        // Maybe check if spawn is in same room as source and use that to decide the movespeed of the miner
        this.miners = this.getMissionCreeps("miner", miners, Creep.BodyDef.staticMinerRemote, { rcl: this.spawn.room.controller.level }, { prespawn: this.memory.analysis.distance });
        if (this.miners.length === 0) {
            haulers = 0;
        }
        this.haulers = this.getMissionCreeps("hauler", haulers, Creep.BodyDef.hauler, { [CARRY]: this.memory.analysis.carryPartsPerHauler - 1 }, { prespawn: 45 }) // Find a way to calc prespawn time better
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