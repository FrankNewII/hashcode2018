function ParserG(text) {
    this.totalState = undefined;
    this.cars = [];
    this.rides = new ParserG.Rides();
    this.parse(text);
    this.initCars();
}

ParserG.prototype.parse = function (text) {
    var rawDate = text.trim().split(/\n/);
    this.totalState = new ParserG.TotalState(rawDate[0]);
    for (var ride = 1; ride < rawDate.length; ride++) {
        this.rides.addRide(rawDate[ride].trim());
    }
};

ParserG.prototype.initCars = function () {
    for ( var id = 0; id < this.totalState.cars; id++ )
        this.cars.push(new ParserG.Car(this.rides, this.totalState));
};

ParserG.prototype.startDay = function () {
    this.nextTick();
};
ParserG.prototype.nextTick = function () {
    var car;
    for ( var id = 0; id < this.totalState.cars; id++ ) {
        car = this.cars[id];

        if (!car.isBusy()) {
            car.searchOptimalRide();
            car.nextTick();
        } else {
            car.nextTick();
        }
    }
};

ParserG.prototype.getPlan = function () {
    var str = "";
    var car;
    var self = this;
    for (var id = 0; id < this.cars.length; id++ ) {
        car = this.cars[id];
        rides = car.choosedRides;
        ridesIds = [];
        rides.forEach(function (v) {
            ridesIds.push(self.rides.getRideId(v));
        });
        str += ridesIds.length + ' ' + ridesIds.join(' ') + '\n';
    }
    console.log(str);
};