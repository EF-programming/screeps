require('loadModules').loadModules();
let loophelper = require('loophelper');

module.exports.loop = function () {
    console.log(`Start: ${Game.cpu.getUsed()}`);
    // State of the empire, for the current tick, is cached in Game.cache.
    Game.cache = { structures: {}, hostiles: {} };
    // State of the empire over many ticks is stored in memory at Memory.empire
    if (!Memory.empire) {
        Memory.empire = {};
    }
    for (let roomName in Game.rooms) {
        if (!Memory.empire['roomName']) {
            Memory.empire['roomName'] = {};
        }
    }

    let operations = loophelper.getOperations();
    for (let operation of operations) {
        operation.init();
    }
    console.log(`After init: ${Game.cpu.getUsed()}`);
    // Right before headCount it might be good to iterate through Game.creeps and assign each creep to the operation it belongs to. Then operations need only to check their assigned creeps instead of all.
    for (let operation of operations) {
        operation.headCount();
    }
    console.log(`After head count: ${Game.cpu.getUsed()}`);
    for (let operation of operations) {
        operation.actions();
    }
    console.log(`After actions: ${Game.cpu.getUsed()}`);
    for (let operation of operations) {
        operation.finalize();
    }

    curSpawn = Game.spawns['Spawn1'];
    curSpawn.room.controller.activateSafeMode();
    if (Object.keys(curSpawn.memory.staticMines).length < 1) {
        //curSpawn.memory.staticMines = {};
        sources = curSpawn.room.find(FIND_SOURCES);
        for (var key in sources) {
            curSpawn.memory.staticMines[sources[key].id] = null;
        }
    }

    var tower = Game.getObjectById('587eb40c4931ee927dba748c');
    if (tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hitsMax - structure.hits > 400
        });
        if (closestDamagedStructure) {
            //tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Manage static miners
    for (var key in curSpawn.memory.staticMines) {

        //if ( curSpawn.memory.staticMines[key].ticksToLive === null || curSpawn.memory.staticMines[key].ticksToLive < 12) {
        //miner = curSpawn.createCreep([WORK,WORK,WORK,WORK,WORK,MOVE], undefined, {role: 'miner'});
        //miner.memory.assignedSource = Game.getObjectById(key);
        //}
    }

    var harvesters = _.filter(Game.creeps, creep => creep.memory.role == 'harvester');
    if (harvesters.length < 2) {
        curSpawn.createCreep([WORK, WORK, CARRY, MOVE], undefined, { role: 'harvester' });
    }
    var upgraders = _.filter(Game.creeps, creep => creep.memory.role == 'upgrader');
    if (upgraders.length < 3) {
        curSpawn.createCreep([WORK, WORK, CARRY, MOVE], undefined, { role: 'upgrader' });
    }
    var upgrader2s = _.filter(Game.creeps, creep => creep.memory.role == 'upgrader2');
    if (upgrader2s.length < 5) {
        curSpawn.createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], undefined, { role: 'upgrader2' });
    }
    var repairers = _.filter(Game.creeps, creep => creep.memory.role == 'repairer');
    if (repairers.length < 1) {
        curSpawn.createCreep([WORK, WORK, CARRY, MOVE, MOVE, MOVE], undefined, { role: 'repairer' });
    }
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    if (builders.length < 3) {
        curSpawn.createCreep([WORK, WORK, CARRY, MOVE], undefined, { role: 'builder' });
    }
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if (creep.memory.role == 'upgrader2') {
            roleUpgrader2.run(creep);
        }
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }
}