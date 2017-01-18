var roleAttack = {

    run: function(creep) {
        
        if (!creep.pos.isNearTo(Game.flags.Flag1)) {
            creep.moveTo(Game.flags.Flag1);
        }
        else {
            target = Game.flags.Flag1.pos.lookFor(LOOK_STRUCTURES)[0];
            creep.dismantle(target);
        }
    }
};

module.exports = roleAttack;