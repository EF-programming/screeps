let mod = {};
module.exports = mod;
mod.initPrototype = function () {
    Structure.prototype.isFull = function () {
        if (this.hasOwnProperty("store")) {
            return _.sum(this.store) === this.storeCapacity;
        }
        else if (this.hasOwnProperty("energy")) {
            return this.energy === this.energyCapacity;
        }
    }
    // resourceType arg is optional.
    Structure.prototype.getStoredAmount = function (resourceType) {
        if (this.hasOwnProperty("store")) {
            if (resourceType === undefined) {
                return _.sum(this.store);
            }
            else {
                return target.store[resourceType];
            }
        }
        else if (target.hasOwnProperty("energy")) {
            return this.energy;
        }
    }
}