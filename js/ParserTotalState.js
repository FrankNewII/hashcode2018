ParserG.TotalState = function (str) {
    var mass = str.split(' ');
    this.rows = +mass[0];
    this.column = +mass[1];
    this.cars = +mass[2];
    this.totalRides = +mass[3];
    this.bonus = +mass[4];
    this.times = +mass[5];
    this.currentTime = 0;
    this.totalCatchedRides = 0;
};