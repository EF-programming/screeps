module.exports = function () {
    // The contents of these files go into the global scope.
    _.assign(global,
        require('constants.js'),
        require('helper.js')
    )

    // Add to prototypes
    require('creep.initPrototype').initPrototype();
    require('roomPosition.initPrototype').initPrototype();
    require('room.initPrototype').initPrototype();
    require('structure.initPrototype').initPrototype();

    Creep.Behavior = require('creep.behavior');
    Creep.BodyDef = require('creep.bodydef');
    _assign(Creep, {
        tasks: {
            dumpEnergy: require('creep.task.dumpEnergy'),
            harvest: require('creep.task.harvest'),
            repair: require('creep.task.repair'),
            staticMine: require('creep.task.staticMine'),
            upgrade: require('creep.task.upgrade'),
            withdrawEnergy: require('creep.task.withdrawEnergy')
        },
        behaviors: {
            hauler: require('creep.behavior.hauler'),
            staticMiner: require('creep.behavior.staticMiner')
        }
    })
}