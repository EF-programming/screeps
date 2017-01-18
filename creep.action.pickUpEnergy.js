let mod = {};
module.exports = mod;
mod.do = function (creep) {
    creep.memory.action = 'pickUpEnergy';
    if (!creep.pos.isNearTo(creep.memory.pickupContainer)) { // Move to container
        creep.moveTo(creep.memory.pickupContainer);
        return false;
    }
    else { // Pick up energy
        creep.withdraw(creep.memory.pickupContainer);
        return true;
    }
}