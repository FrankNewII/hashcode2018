ParserG.Rides.Ride = function (str) {
    var rawRide = str.split(' ');
    this.x1 = +rawRide[0];
    this.y1 = +rawRide[1];
    this.x2 = +rawRide[2];
    this.y2 = +rawRide[3];
    this.dist = Math.abs(this.x1 - this.x2 ) + Math.abs(this.y1 - this.y2);
    this.startTime = +rawRide[4];
    this.finishTime = +rawRide[5];
    this.catched = false;
};

ParserG.Rides.Ride.prototype.optimalRide = function (time, startX, startY) {
    var isEnoughTimeForStart = time === this.startTime;
    var optimalPosX = this.x1 === startX;
    var optimalPosY = this.y1 === startY;

    return !this.catched && isEnoughTimeForStart && optimalPosX && optimalPosY;
};

ParserG.Rides.Ride.prototype.futureRide = function (time, startX, startY) {
    var isEnoughTimeForStart = this.finishTime >= time;
    var optimalPosX = this.x1 === startX;
    var optimalPosY = this.y1 === startY;

    return !this.catched && isEnoughTimeForStart && optimalPosX && optimalPosY;
};

ParserG.Rides.Ride.prototype.catch = function () {
    this.catched = true;
};