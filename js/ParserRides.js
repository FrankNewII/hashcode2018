ParserG.Rides = function (totalState) {
  this.rides = [];
  this.totalState = totalState;
};

ParserG.Rides.prototype.addRide = function (str) {
  this.rides.push(new ParserG.Rides.Ride(str));
};

ParserG.Rides.prototype.getRide = function (time, startX, startY) {
    for( var id = 0; id < this.rides.length; id++ ) {
        var ride = this.rides[id];

        if( ride.optimalRide(time, startX, startY) ) {
            return ride;
        }
    }
};

ParserG.Rides.prototype.getRideAtThatPlace = function (time, startX, startY) {
    var minWaitTime = Infinity;
    var id;
    for( var i = 0; i < this.rides.length; i++ ) {
        var ride = this.rides[i];

        if( ride.futureRide(time, startX, startY) && ride.startTime < minWaitTime) {
            id = i;
        }
    }

    return this.rides[id];
};

 ParserG.Rides.prototype.getNearestRide = function (time, startX, startY) {
    var dist = Infinity;
    var waitTime = Infinity;
    var id;
    var nDist;
    var nWaitTime;
    var ride;
    var bonus;
    for ( var i = 0; i < this.rides.length; i++ ) {
        ride = this.rides[i];
        nDist = Math.abs(ride.x1 - startX) + Math.abs( ride.y1 - startY );
        needWait = ride.startTime - nDist - time;
        nWaitTime = nDist + time + ( needWait > 0 ? needWait : 0 );
        bonus = (nWaitTime > -1 ) ? this.totalState.bonus : 0;

        if ( !ride.catched
            && nWaitTime + ride.dist < ride.finishTime
            && dist > nDist
            ) {

            var lastTotalTime = waitTime + dist;
            var newTotalTime = nDist + nWaitTime - bonus;

            if ( lastTotalTime >= newTotalTime ) {
                id = i;
                dist = nDist;
                waitTime = nWaitTime;
            }
        }
    }

    return this.rides[id];
};

ParserG.Rides.prototype.getNearestFutureRide = function (time, startX, startY) {
    var dist = Infinity;
    var id;
    var nDist = 1;
    var ride;
    for ( var i = 0; i < this.rides.length; i++ ) {
        ride = this.rides[i];
        nDist = Math.abs(ride.x1 - startX) + Math.abs(ride.y1 - startY);

        if ( !ride.catched && nDist + time < ride.startTime && dist >= nDist ) {
            id = i;
        }
    }

    return this.rides[id];
};

ParserG.Rides.prototype.getRideId = function (ride) {
    return this.rides.indexOf(ride);
};