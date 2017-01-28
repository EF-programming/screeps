let BodyDef = function () {
    // returns the best body possible given the room control level and the energy available
    this.haulerBodyDef = {
        baseBody: [WORK, CARRY, CARRY, CARRY], // 350
        multiBody: [CARRY], // 150
        multiCount: function (RCL) {
            switch (RCL) {
                case 1:
                case 2:
                    return ERR_RCL_NOT_ENOUGH;
                case 3:
                    return 2;
                case 4:
                    return 4;
                case 5:
                    return 6;
                case 6:
                case 7:
                case 8:
                    return 6;
            }
        },
        speed: SPEED_ROAD_1_TICK,
        speedIgnoreCarryParts: false
    }
    this.staticMinerLocalBodyDef = { // Local means it is designed to mine in the room that it spawns in. Reflected by slow move speed.
        baseBody: [CARRY, WORK, WORK, WORK, WORK], // 550
        multiBody: [WORK],
        multiCount: function (RCL) {
            switch (RCL) {
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
    this.upgraderBodyDef = {
        baseBody: [CARRY, WORK, WORK, WORK, WORK, WORK], // 550
        multiBody: [WORK], // Base body gets 1 fatigue per step. Can go up to multi 3 without slowing down more. If more than 8 work parts are needed, prob make another body def for super upgrader.
        multiCount: function (RCL) {
            switch (RCL) {
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
    this.workerBodyDef = {
        baseBody: [WORK, CARRY], // 200
        multiBody: [WORK, CARRY],
        multiCount: function (RCL) {
            switch (RCL) {
                case 1:
                case 2:
                case 3:
                case 4:
                    return RCL - 1;
                case 5:
                case 6:
                    return 3;
            }
        },
        speed: SPEED_ROAD_1_TICK,
        speedIgnoreCarryParts: false
    }
    this.getBodyWithinBudget = function (bodyDef, RCL, budget) { // A lot of these calculations could be hardcoded in body defs. Faster but harder to maintain.
        // Get the number of move parts for basebody and multibody NOT ROUNDED
        let movePartsForBaseBody = getMovePartsAmount(bodyDef.baseBody, bodyDef.speed, bodyDef.ignoreCarry);
        let movePartsForMulti = getMovePartsAmount(bodyDef.multiBody, bodyDef.speed, bodyDef.ignoreCarry);
        // Calculate the price of baseBody with non-rounded move parts
        let basePrice = getPrice(bodyDef.baseBody);
        // Check if we can afford the smallest creep with enough move parts.
        // The math is used to round the price to the next full move part
        if (basePrice + Math.ceil(movePartsForBaseBody) * BODYPART_COST[MOVE] > budget) {
            return ERR_NOT_ENOUGH_ENERGY;
        }
        let multiPrice = getPrice(bodyDef.multiBody);
        let maxMulti = Math.floor((budget - basePrice - movePartsForBaseBody * BODYPART_COST[MOVE]) / (multiPrice + movePartsForMulti * BODYPART_COST[MOVE])); // How many multis can we afford
        let movePartsCount = movePartsForBaseBody + movePartsForMulti * maxMulti;
        // Check if the rounding to the next full move part overshoots the budget
        if (basePrice + multiPrice * maxMulti + Math.ceil(movePartsCount) * BODYPART_COST[MOVE] > budget) {
            maxMulti--;
        }
        maxMulti = Math.min(bodyDef.multiCount(RCL), maxMulti); // Take the lowest multi allowed between RCL and budget

        return composeBody(bodyDef, maxMulti, movePartsCount);
    }
    // Returns the number of MOVE parts needed to move at the given speed. Returns float value by default, needs to be rounded up at some point.
    // Assumes no MOVE parts are present in 'body' arg.
    // roundUp = true will round the number of move parts up to the nearest integer, which is the necessary amount to move at the requested speed.
    this.getMovePartsAmount = function (body, speed, ignoreCarry, roundUp = false) {
        let partCount = body.length;
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
    // Builds the finished creep body. Body parts are added in an order that aims to 
    // keep the highest efficiency possible when the body gets damaged. Should be
    // good for most non-weird cases.
    this.composeBody = function (bodyDef, multiCount, movePartsCount) {
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
        // let composedBody = bodyDef.baseBody.slice();
        // for (i = 0; i < multiCount; i++) {
        //     composedBody = composedBody.concat(bodyDef.multiBody);
        // }

        // iterate array in reverse, adding moves every x parts lol...
        //composedBody.sort(partsComparator);

        // If the 2nd to last part is a HEAL, make it the last part. Swapping the 2nd to last part is
        // fine, but be careful if changing it to swap some other earlier index because it can unbalance the 
        // part-to-move-part pattern and make your creep's movement slower if it is damaged.
        if (composedBody[composedBody.length - 2] === HEAL) { 
            parts.splice(-2, 1);
            parts.push(HEAL);
        }
        return composedBody;
    }
    this.composeBodyNotSuperSorted = function (bodyDef, multiCount, movePartsCount) {
        let composedBody = bodyDef.baseBody.slice();
        for (i = 0; i < multiCount; i++) {
            composedBody.apply(bodyDef.multiBody);
        }
        for (i = 0; i < movePartsCount; i++) {
            composedBody.push(MOVE);
        }
        //composedBody.sort(partsComparator);
        return composedBody;
    }

    this.getPrice = function (body) {
        let price = 0;
        for (let i = 0; i < body.length; i++) {
            price += BODYPART_COST[body[i]];
        }
        return price;
    }
    // Taken from OCS
    this.partsComparator = function (partA, partB) {
        let partsOrder = [TOUGH, CLAIM, WORK, CARRY, ATTACK, RANGED_ATTACK, HEAL, MOVE];
        let indexOfA = partsOrder.indexOf(a);
        let indexOfB = partsOrder.indexOf(b);
        return indexOfA - indexOfB;
    }
}
module.exports = BodyDef;