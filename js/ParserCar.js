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

    var timeTravelToStart = Math.abs(this.x - startX) + Math.abs(startY - this.y) + (waitTime > 0? waitTime: 0);

    this.busyTime = timeTravelToStart + Math.abs(startX - finishX) + Math.abs(startY - finishY);
    this.time -= this.busyTime;
    this.currentTime += this.busyTime;
    this.x = startX;
    this.y = startY;
};

ParserG.Car.prototype.isBusy = function () {
    return this.busyTime > 0;
};

ParserG.Car.prototype.nextTick = function () {
    this.busyTime--;
};

ParserG.Car.prototype.searchOptimalRide = function (length) {
  var perfectRide = this.rides.getRide(this.currentTime, this.x, this.y);
  var nearestRide = this.rides.getRideAtThatPlace( this.currentTime, this.x, this.y );
  var futureRide = this.rides.getNearestRide(this.currentTime, this.x, this.y);
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
  this.catch(optimalRide);
  if ( !length || length != this.choosedRides.length ) {
      this.searchOptimalRide(this.choosedRides.length);
  }
};

ParserG.Car.prototype.catchRide = function (ride) {
    this.totalState.totalCatchedRides++;
    ride.catch();
    this.newTravel(ride.x1, ride.y1, ride.x2, ride.y2, ride.startTime );
    this.choosedRides.push( ride );
};

