let mod = {};
module.exports = mod;
mod.initPrototype = function () {
    RoomPosition.prototype.getPositionAtDirection = function (direction) {
        let x = this.x;
        let y = this.y;

        if (direction === 1) {
            y -= 1;
        }
        else if (direction === 2) {
            y -= 1;
            x += 1;
        }
        else if (direction === 3) {
            x += 1;
        }
        else if (direction === 4) {
            x += 1;
            y += 1;
        }
        else if (direction === 5) {
            y += 1;
        }
        else if (direction === 6) {
            y += 1;
            x -= 1;
        }
        else if (direction === 7) {
            x -= 1;
        }
        else if (direction === 8) {
            x -= 1;
            y -= 1;
        }
        return new RoomPosition(x, y, this.roomName);
    }
}