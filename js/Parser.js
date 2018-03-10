function ParserG(text) {
    this.totalState = undefined;
    this.cars = [];
    this.rides = undefined;
    this.parse(text);
    this.initCars();
}

ParserG.prototype.parse = function (text) {
    var rawDate = text.trim().split(/\n/);
    this.totalState = new ParserG.TotalState(rawDate[0]);
    this.rides = new ParserG.Rides(this.totalState);
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

ParserG.prototype.recursiveDevidedRide = function () {
    var timePart = this.totalState.times / 10;
    var totalRides = this.rides.rides.length / 10;
    var rides = this.rides.rides.sort(function (a, b) {
        return a.startTime - b.startTime;
    });

    for (var part = 0; part < 10; part++) {
        var currentStartPos = totalRides * part;
        var currentEndPos = totalRides + currentStartPos;
        var newPart = [];
        for (var i = currentStartPos; i < currentEndPos; ++i ) {
            newPart.push(rides[i]);
        }

        this.rides.rides = newPart;

        this.cars
            .forEach(function (car) {
                car.time = timePart * part;
                var maxScoreWay = car.recursiveSearchOptimalRide(newPart, car.time, car.currentWay);
                console.log(maxScoreWay);
                maxScoreWay.choosed.reverse().forEach(function (v1) {
                    car.choosedRides.push(v1);
                    v1.catched = true;
                });
            });
    }
};

ParserG.prototype.searchOptimalRide = function () {
    this.cars.forEach(function (v) {
        var maxScoreWay = v.searchOptimalRide(v.rides.rides, v.currentTime, []);
        console.log(maxScoreWay);
    });
};

ParserG.prototype.recursiveSearchOptimalRide = function () {
      this.cars.forEach(function (v) {
          var maxScoreWay = v.recursiveSearchOptimalRide(v.rides.rides, v.currentTime, []);
          v.choosedRides = maxScoreWay.choosed.reverse();
          maxScoreWay.choosed.forEach(function (v) {
              v.catched = true;
          });
          console.log(maxScoreWay);
      });
};