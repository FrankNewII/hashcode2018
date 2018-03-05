ParserG.Car = function (rides, totalState) {
    this.busyTime = 0;
    this.x = 0;
    this.y = 0;
    this.totalState = totalState;
    this.time = this.totalState.times;
    this.currentTime = 0;
    this.rides = rides;
    this.choosedRides = [];
};

ParserG.Car.prototype.newTravel = function (startX, startY, finishX, finishY, startTime) {

    var waitTime = startTime - this.totalState.currentTime;

    var timeTravelToStart = Math.abs(startX - this.x) + Math.abs(startY - this.y) + (waitTime > 0? waitTime: 0);

    this.busyTime = timeTravelToStart + Math.abs(finishX - startX) + Math.abs(finishY - startY);
    this.time -= this.busyTime;
    this.currentTime += this.busyTime;
    this.x = finishX;
    this.y = finishY;
};

ParserG.Car.prototype.isBusy = function () {
    return this.busyTime > 0;
};

ParserG.Car.prototype.nextTick = function () {
    this.busyTime--;
};

ParserG.Car.prototype.searchOptimalRide = function (length) {
  var perfectRide = this.rides.getRide(this.currentTime, this.x, this.y);
  var nearestRide = this.rides.getNearestRide( this.currentTime, this.x, this.y );
  var futureRide = this.rides.getRideAtThatPlace(this.currentTime, this.x, this.y);
  var optimalRide;
  if ( !perfectRide ) {
      if (futureRide) {
          if (nearestRide) {
              if(Math.abs(nearestRide.x1 - this.x) + Math.abs(nearestRide.y1 - this.x ) >= futureRide.startTime ) {
                  optimalRide = futureRide;
              } else {
                  optimalRide = nearestRide;
              }
          } else {
              optimalRide = futureRide;
          }

      } else {
          if(nearestRide)
              optimalRide = nearestRide;
      }
  } else {
      if(perfectRide)
        optimalRide = perfectRide;
  }
  optimalRide && this.catchRide(optimalRide);
  if ( length === undefined || length != this.choosedRides.length ) {
      this.searchOptimalRide(this.choosedRides.length);
  }
};

ParserG.Car.prototype.recursiveSearchOptimalRide = function (rides, currentTime, currentWay) {

    var maxCash = {
        score: 0,
        timeover: 0,
        choosed: []
    };

    var currentCash = 0;
    var startX = this.x;
    var startY = this.y;

    for ( var i = 0; i < rides.length; i++ ) {

        var ride = rides[i];
        if ( !ride.catched && currentWay.indexOf(ride) === -1 ) {
            var timeToPoint = Math.abs( this.x - ride.x1 ) + Math.abs( this.y - ride.y1 );
            var waitTime = ride.startTime - ( currentTime + timeToPoint );
            var totalSpendTime = timeToPoint + ride.dist + (waitTime > 0 ? waitTime : 0);

            if ( totalSpendTime + currentTime <= ride.finishTime ) {

                var bonus = currentTime + timeToPoint < ride.startTime ? this.totalState.bonus : 0;

                this.x = ride.x2;
                this.y = ride.y2;
                currentWay.push(ride);
                var _tmpRides = this.recursiveSearchOptimalRide( rides, currentTime + totalSpendTime, currentWay);
                currentWay.pop();
                currentCash = ride.dist + bonus + _tmpRides.score;

                if ( maxCash.score < currentCash ) {

                    maxCash = _tmpRides;
                    maxCash.score += currentCash;
                    maxCash.timeover += currentTime;
                    maxCash.choosed.push(ride);
                } else {

                    this.x = startX;
                    this.y = startY;
                }
            }
        }
    }
    return maxCash;
};

ParserG.Car.prototype.catchRide = function (ride) {
    this.totalState.totalCatchedRides++;
    ride.catch();
    this.newTravel(ride.x1, ride.y1, ride.x2, ride.y2, ride.startTime );
    this.choosedRides.push( ride );
};

