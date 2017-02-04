class Mission {
    // operation: the operation this mission belongs to
    constructor(operation, missionName) {
        this.operation = operation; // Not sure if this is needed yet.
        this.missionName = missionName;
        this.roomName = operation.roomName;
        this.hasVision = operation.hasVision;
        this.flag = operation.flag;
        this.room = operation.flag.room;
        if (!operation.memory[this.missionName]) {
            operation.memory[this.missionName] = {};
        }
        this.memory = operation.memory[this.missionName];
    }

    // Finds creeps belonging to mission by checking names in Game.creeps.
    // namePrefix is the role of the creep such as "miner".
    findMissionCreeps(namePrefix) {
        let creepNames = [];
        for (let creepName in Game.creeps) {
            if (creepName.startsWith(namePrefix) && creepName.includes(this.missionName)) {
                creepNames.push(creepName);
            }
        }
        return creepNames;
    }
    // Maintains a creep population at the given amount. Prespawns by spawn time by default.
    // Ex: if a creep takes 27 ticks to spawn, will start spawning a creep when one of the creeps alive
    // has 27 or less ticks to live.
    // Returns list of creeps matching role. Does not include spawning creeps since they can't be given commands yet.
    // roleName: role of the creep, string put at the start of the creep's name.
    // amount: target population amount
    // bodydef: BodyDef definition to use when spawning a new creep. Ex: Creep.BodyDef.haulerBodyDef
    // bodyspecs: Combined with bodydef to describe the bodyparts the creeps should spawn with (check creep.bodydef class for details)
    // opts: Optional args
    // --prespawn:number Start spawning by this many extra ticks in advance on top of spawnTime prespawn (ex: travel time ticks)
    // --noprespawn:bool Disable prespawn entirely.
    // --nospawn:bool Do not spawn new creeps if population below target. False by default.
    // --flexbudget:bool Allow creating creeps with smaller bodies if spawn does not have enough energy. False by default.
    getMissionCreeps(roleName, amount, bodydef, bodyspecs, opts) {
        if (!bodyspecs) { bodyspecs = {}; }
        if (!opts) { opts = {}; }
        if (!this.memory.creeps) { this.memory.creeps = []; }
        let creeps = []; // Living creeps that will be returned by this function.
        // The creeps belonging to the mission are stored in memory. If the memory is not there
        // it finds the creeps by iterating Game.creeps and grabbing names that match this mission+role.
        if (!this.memory.creeps[roleName]) {
            this.memory.creeps[roleName] = this.findMissionCreeps(roleName);
        }
        // Check if any creeps died since last tick. Also check their ttl, to prespawn.
        let goodCreeps = 0; // Sum of creeps with ttl>spawnTime and currently spawning creeps
        for (let i = 0; i < this.memory.creeps[roleName].length; i++) {
            let creepName = this.memory.creeps[roleName][i];
            let creep = Game.creeps[creepName];
            if (creep) {
                if (!creep.spawning) {
                    creeps.push(creep);
                }
                let prespawnTicks = 0;
                if (!opts.noprespawn) {
                    prespawnTicks = creep.body.length * CREEP_SPAWN_TIME; // CREEP_SPAWN_TIME is the amount of ticks for 1 part
                    if (opts.prespawn !== undefined) {
                        prespawnTicks += opts.prespawn;
                    }
                }
                if (!creep.ticksToLive || creep.ticksToLive > prespawnTicks) {
                    goodCreeps++;
                }
            }
            else { // Creep is dead
                this.memory.creeps[roleName].splice(i, 1);
                delete Memory.creeps[creepName];
                i--;
            }
        }
        // Finished collecting living creeps. Now spawn/prespawn creeps if population is too small.
        if (goodCreeps < amount) { // Only spawns 1 at a time for now.
            let creepName = roleName + Math.floor(Math.random() * 100) + "_" + this.missionName; // Will rarely fail because of math.random creating an existing name but it's a very low priority issue to fix.
            let body = Creep.BodyDef.getBody(bodydef, bodyspecs);
            if (this.spawn.canCreateCreep(body, creepName) === OK) {
                this.spawn.createCreep(body, creepName, { roleName: roleName });
                this.memory.creeps[roleName].push(creepName);
            }
        }
        return creeps;
    }
    finalizeMission() { } // Declared here to not force every mission to implement this method, because not all of them need it.
}
module.exports = Mission;
