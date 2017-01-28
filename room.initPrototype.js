let mod = {};
module.exports = mod;
mod.initPrototype = function () {
    // Taken from bonzAI
    Room.prototype.findStructures = function (structureTypeString) {
        if (!Game.cache.structures[this.name]) {
            Game.cache.structures[this.name] = _.groupBy(this.find(FIND_STRUCTURES), x => x.structureType);
        }
        return Game.cache.structures[this.name][structureTypeString] || [];
    };
    // Taken from bonzAI
    Object.defineProperty(Room.prototype, "hostiles", {
        get: function myProperty() {
            if (!Game.cache.hostiles[this.name]) {
                let hostiles = this.find(FIND_HOSTILE_CREEPS);
                let filteredHostiles = [];
                for (let hostile of hostiles) {
                    let username = hostile.owner.username;
                    let isEnemy = helper.checkEnemy(username, this.name);
                    if (isEnemy) {
                        filteredHostiles.push(hostile);
                    }
                }
                Game.cache.hostiles[this.name] = filteredHostiles;
            }
            return Game.cache.hostiles[this.name];
        }
    });
}