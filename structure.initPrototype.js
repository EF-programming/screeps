let mod = {};
module.exports = mod;
mod.initPrototype = function () {
    Structure.prototype.isFull = function () {
        if ("store" in this) {
            return _.sum(this.store) === this.storeCapacity;
        }
        else if ("energy" in this) {
            return this.energy === this.energyCapacity;
        }
    }
    // resourceType arg is optional.
    Structure.prototype.getStoredAmount = function (resourceType) {
        if ("store" in this) {
            if (resourceType === undefined) {
                return _.sum(this.store);
            }
            else {
                return this.store[resourceType];
            }
        }
        else if ("energy" in this) {
            return this.energy;
        }
    }
}