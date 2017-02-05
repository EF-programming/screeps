// Change body sizes to be based on room.energyCapacity instead of RCL. With option to base on room.energyAvailable
class BodyDef {
    constructor() {
        this.hauler = {
            baseBody: [WORK, CARRY],
            multiBody: [CARRY],
            multiCount: function (specs) {
                if (specs[CARRY]) {
                    return specs[CARRY];
                }
                switch (specs.rcl) {
                    case 1:
                    case 2:
                        return ERR_RCL_NOT_ENOUGH;
                    case 3:
                        return 4;
                    case 4:
                        return 12;
                    case 5:
                        return 15;
                    case 6:
                        return 27;
                    case 7:
                    case 8:
                        return 29;
                }
            },
            speed: SPEED_ROAD_1_TICK,
            speedIgnoreCarryParts: false
        }
        this.guard = {
            baseBody: [TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK],
            multiBody: [ATTACK],
            multiCount: function (specs) {
                return 0;
            },
            speed: SPEED_PLAINS_1_TICK,
            speedIgnoreCarryParts: false
        }
        this.reserver = {
            baseBody: [CLAIM, CLAIM],
            multiBody: [],
            multiCount: function (specs) {
                return 0;
            },
            speed: SPEED_PLAINS_1_TICK,
            speedIgnoreCarryParts: false
        }
        this.scout = {
            baseBody: [MOVE],
            multiBody: [],
            multiCount: function (specs) {
                return 0;
            },
            speed: SPEED_PLAINS_1_TICK,
            speedIgnoreCarryParts: false
        }
        this.staticMinerLocal = { // Local means it is designed to mine in the room that it spawns in. Reflected by slow move speed.
            baseBody: [CARRY, WORK, WORK, WORK, WORK], // 550
            multiBody: [WORK],
            multiCount: function (specs) {
                switch (specs.rcl) {
                    case 1:
                    case 2:
                        return ERR_RCL_NOT_ENOUGH;
                    case 3:
                        return 1;
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        return 2; // 1 for now but can be 2
                }
            },
            speed: SPEED_ROAD_2_TICKS,
            speedIgnoreCarryParts: true
        }
        this.staticMinerRemote = { // Remote means it is designed to mine in a different room from the one it spawns in. Reflected by normal move speed.
            baseBody: [CARRY, WORK, WORK, WORK, WORK], // 550
            multiBody: [WORK],
            multiCount: function (specs) {
                switch (specs.rcl) {
                    case 1:
                    case 2:
                        return ERR_RCL_NOT_ENOUGH;
                    case 3:
                        return 1;
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        return 2; // 1 for now but can be 2
                }
            },
            speed: SPEED_ROAD_1_TICK,
            speedIgnoreCarryParts: true
        }
        this.upgrader = {
            baseBody: [CARRY, WORK, WORK, WORK, WORK, WORK], // 550
            multiBody: [WORK], // Base body gets 1 fatigue per step. Can go up to multi 3 without slowing down more. If more than 8 work parts are needed, prob make another body def for super upgrader.
            multiCount: function (specs) {
                switch (specs.rcl) {
                    case 1:
                    case 2:
                        return ERR_RCL_NOT_ENOUGH;
                    case 3:
                        return 1;
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        return 1; // 1 for now but can be 2
                }
            },
            speed: SPEED_ROAD_2_TICKS,
            speedIgnoreCarryParts: true
        }
        this.worker = {
            baseBody: [WORK, CARRY], // 200
            multiBody: [WORK, CARRY],
            multiCount: function (specs) {
                switch (specs.rcl) {
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        return rcl - 1;
                    case 5:
                    case 6:
                        return 4;
                    case 7:
                    case 8:
                        return 5;
                }
            },
            speed: SPEED_ROAD_1_TICK,
            speedIgnoreCarryParts: false
        }
    }
    // bodyDef: one of the bodydef objects defined in this class.
    // specs: object containing optional args listed below, setting limits on the minimum/maximum size of the creep
    // --rcl: rcl of room with spawner. Default 8.
    // --budget:number Maximum energy willing to spend. Will return the biggest body that fits within budget. Default no budget.
    // --bodypart:number Desired number of this body part. Only bodyparts relevant to bodydef are checked (hauler won't equip 5 attack parts).
    getBody(bodyDef, specs) { // A lot of these calculations could be hardcoded in body defs. Faster but harder to maintain.
        if (!specs.rcl) { specs.rcl = 8 };
        // Get the number of move parts for basebody and multibody NOT ROUNDED
        let movePartsForBaseBody = this.getMovePartsAmount(bodyDef.baseBody, bodyDef.speed, bodyDef.ignoreCarry);
        let movePartsForMulti = this.getMovePartsAmount(bodyDef.multiBody, bodyDef.speed, bodyDef.ignoreCarry);
        // Calculate the price of baseBody with non-rounded move parts
        let basePrice = this.getPrice(bodyDef.baseBody);
        // The math is used to round the price to the next full move part
        let multiPrice = this.getPrice(bodyDef.multiBody);
        let maxMulti;
        let movePartsCount;
        if (specs.budget !== undefined) {
            // Check if we can afford the smallest creep with enough move parts.
            if (basePrice + Math.ceil(movePartsForBaseBody) * BODYPART_COST[MOVE] > specs.budget) {
                return ERR_NOT_ENOUGH_ENERGY;
            }
            maxMulti = Math.floor((budget - basePrice - movePartsForBaseBody * BODYPART_COST[MOVE]) / (multiPrice + movePartsForMulti * BODYPART_COST[MOVE])); // How many multis can we afford
            movePartsCount = movePartsForBaseBody + movePartsForMulti * maxMulti;
            // Check if the rounding to the next full move part overshoots the budget
            if (basePrice + multiPrice * maxMulti + Math.ceil(movePartsCount) * BODYPART_COST[MOVE] > budget) {
                maxMulti--;
            }
            maxMulti = Math.min(bodyDef.multiCount(specs), maxMulti); // Take the lowest multi allowed between rcl and budget
        }
        else {
            maxMulti = bodyDef.multiCount(specs);
        }
        movePartsCount = movePartsForBaseBody + movePartsForMulti * maxMulti;
        return this.composeBody(bodyDef, maxMulti, Math.ceil(movePartsCount));
    }
    // Returns the number of MOVE parts needed to move at the given speed. Returns float value by default, needs to be rounded up at some point.
    // Assumes no MOVE parts are present in 'body' arg.
    // roundUp = true will round the number of move parts up to the nearest integer, which is the necessary amount to move at the requested speed.
    getMovePartsAmount(body, speed, ignoreCarry, roundUp = false) {
        let partCount = body.length;
        if (partCount === 1 && body[0] === MOVE) {
            return 0;
        }
        if (ignoreCarry) {
            for (let i = 0; i < body.length; i++) {
                if (body[i] === CARRY) {
                    partCount--;
                }
            }
        }
        if (roundUp) {
            return Math.ceil(partCount * speed);
        }
        else {
            return partCount * speed;
        }
    }
    // Builds the finished creep body.
    composeBody(bodyDef, multiCount, movePartsCount) {
        let composedBody = bodyDef.baseBody.slice();
        for (let i = 0; i < multiCount; i++) {
            Array.prototype.push.apply(composedBody,bodyDef.multiBody);
        }
        for (let i = 0; i < movePartsCount; i++) {
            composedBody.push(MOVE);
        }
        //composedBody.sort(partsComparator);
        return composedBody;
    }
    // Builds the finished creep body. Body parts are ordered in a way that aims to keep
    // the highest general efficiency at all percentages of body damage. This is not 
    // the best order for all tasks.
    composeBodySuperSorted(bodyDef, multiCount, movePartsCount) {
        // Count the number of each part
        let partCount = {};
        partCount[WORK] = 0;
        partCount[CARRY] = 0;
        partCount[ATTACK] = 0;
        partCount[RANGED_ATTACK] = 0;
        partCount[TOUGH] = 0;
        partCount[HEAL] = 0;
        partCount[CLAIM] = 0;

        let basePartCount = _.countBy(bodyDef.baseBody);
        let multiPartCount = _.countBy(bodyDef.multiBody);
        for (key in partCount) {
            partCount[key] += basePartCount[key] || 0;
            partCount[key] += multiPartCount[key] * multiCount || 0;
        }
        // Move parts are not spread through tough and claim parts.
        let movePartSpread = partCount[WORK] + partCount[CARRY] + partCount[ATTACK] + partCount[RANGED_ATTACK] + partCount[HEAL];
        let movePartInterval = 1 / bodyDef.speed;
        let composedBody = [];
        let movePartsUsedInFirstPart = Math.floor((partCount[TOUGH] + partCount[CLAIM]) / movePartInterval);
        composedBody.apply(new Array(partCount[TOUGH]).fill(TOUGH));
        composedBody.apply(new Array(partCount[CLAIM]).fill(CLAIM));
        composedBody.apply(new Array(movePartsUsedInFirstPart).fill(MOVE));
        let iStop = composedBody.length; // Indicates the array section where move parts should not be distributed later.
        let workP = partCount[WORK];
        let carryP = partCount[CARRY];
        let workCarryPairs = Math.min(workP, carryP);
        for (let i = 0; i < workCarryPairs; i++) {
            composedBody.push(WORK, CARRY);
        }
        let unpairedPartCount = Math.abs(workP - carryP);
        if (unpairedPartCount != 0) {
            let unpairedPartName = workP > carryP ? WORK : CARRY;
            for (let i = 0; i < unpairedPartCount; i++) {
                composedBody.push(unpairedPartName);
            }
        }
        composedBody.apply(new Array(partCount[ATTACK]).fill(ATTACK));
        composedBody.apply(new Array(partCount[RANGED_ATTACK]).fill(RANGED_ATTACK));
        composedBody.apply(new Array(partCount[HEAL]).fill(HEAL));
        let movePartsRemaining = movePartsCount - movePartsUsedInFirstPart - 1; // -1 because one move part will be added later 
        let movePartIntervalCounter = movePartInterval;
        for (let i = composedBody.length - 1; i >= iStop; i--) {
            movePartIntervalCounter--;
            if (movePartIntervalCounter === 0) {
                composedBody.splice(i, 0, MOVE); // Inefficient
                movePartsRemaining--;
                if (movePartsRemaining === 0) {
                    break;
                }
                movePartIntervalCounter = movePartInterval;
                continue;
            }
        }        // Alternate algorithm: instead of inserting move parts like above, find the move pattern within work,carry,..,heal parts and add them while adding those parts.
        if (movePartsCount > 0) { // Append one final move part at the end. Check for bigger than 0 is if a creep has 0 move parts total, we don't want to add a move part.
            composedBody.push(MOVE);
        }

        // If the 2nd to last part is a HEAL, make it the last part. Swapping the 2nd to last part is
        // fine, but be careful if changing it to swap some other earlier index because it can unbalance the 
        // part-to-move-part pattern and make your creep's movement slower if it is damaged.
        if (composedBody[composedBody.length - 2] === HEAL) {
            parts.splice(-2, 1);
            parts.push(HEAL);
        }
        return composedBody;
    }
    getPrice(body) {
        let price = 0;
        for (let i = 0; i < body.length; i++) {
            price += BODYPART_COST[body[i]];
        }
        return price;
    }
    // Taken from OCS
    // Pass as arg to sorting function to sort bodyparts in this order.
    partsComparator(partA, partB) {
        let partsOrder = [TOUGH, CLAIM, WORK, CARRY, ATTACK, RANGED_ATTACK, HEAL, MOVE];
        let indexOfA = partsOrder.indexOf(a);
        let indexOfB = partsOrder.indexOf(b);
        return indexOfA - indexOfB;
    }
}
module.exports = BodyDef;