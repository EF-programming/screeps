let mod = {};
module.exports = mod;
mod.loadModules = function () {
    // The contents of these files go into the global scope.
    _.assign(global,
        require('constants.js'),
        require('helper.js')
        // If loopHelper is needed in many files, put it here.
    );

    // Add to prototypes
    require('creep.initPrototype').initPrototype();
    require('roomPosition.initPrototype').initPrototype();
    require('room.initPrototype').initPrototype();
    require('structure.initPrototype').initPrototype();

    Creep.BodyDef = require('creep.bodydef');
    _assign(Creep, {
        tasks: {
            build: require('creep.task.build'),
            dumpEnergy: require('creep.task.dumpEnergy'),
            harvest: require('creep.task.harvest'),
            repair: require('creep.task.repair'),
            staticMine: require('creep.task.staticMine'),
            upgrade: require('creep.task.upgrade'),
            withdrawEnergy: require('creep.task.withdrawEnergy')
        },
        behaviors: {
            hauler: require('creep.behavior.hauler'),
            staticMiner: require('creep.behavior.staticMiner'),
            worker: require('creep.behavior.worker')
        }
    });
}