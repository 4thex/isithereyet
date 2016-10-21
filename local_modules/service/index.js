module.exports = function() {
    // private
    var schedule = require('./schedule.json');
    
    /**
     * @param {object} stop The stop in the schedule
     * @param {date} time The date and time to compare to
     * @param {number} offset The timezone offset in minutes
     * @param {boolean} snow Indicates if using the snow schedule
     */
    var next = function(stop, time, offset, snow) {
        // Adjust for timezone offset
        time.setMinutes(time.getMinutes() - offset);
        // Convert time to seconds since midnight
        var ssm = time.getHours()*60*60+time.getMinutes()*60+time.getSeconds();
        // Determine if we should look in weekdays, saturdays, or snowdays
        var day = time.getDay();
        var times;
        if(day == 0) {
            // Sunday with no bus
            throw "Today is Sunday. There are no busses.";
        } else if(day < 6) {
            // It's a weekday
            times = stop.value.arrivals.weekdays;
        } else {
            // It's Saturday
            times = stop.value.arrivals.saturdays;
        }
        // Find the time in schedule that is next higher than time
        var result = {};
        result.time = times.find(function(stopTimeString) {
            var parts = stopTimeString.split(':');
            var stopSsm = Number(parts[0])*60*60+Number(parts[1])*60;
            if(stopSsm > ssm) {
                var diffSeconds = stopSsm-ssm;
                var waitMinutes = Math.floor((diffSeconds)/60);
                var waitSeconds = diffSeconds%60;
                result.wait = {
                    minutes: waitMinutes,
                    seconds: waitSeconds
                };
                return true;
            } else {
                return false;
            }
        });
        return result;
    }
    
    var distance = function(lat1, lat2, lon1, lon2) {
        var dlon = (lon1 - lon2) * 49.28;
        var dlat = (lat1 - lat2) * 69.09;
        var d = Math.sqrt(Math.pow(dlat,2) + Math.pow(dlon,2));
        return d;
    };    

    var closest = function(lat, lon) {
        var key = Object.keys(schedule).sort(function (one, other) {
            var oneLocation = schedule[one].location;
            var otherLocation = schedule[other].location;
            var d1 = distance(lat, lon, oneLocation.latitude, oneLocation.longitude);
            var d2 = distance(lat, lon, otherLocation.latitude, otherLocation.longitude);
            return d1>d2?1:-1;
        }).shift();
        var result = {};
        result.id = key;
        result.value = schedule[key];
        return result;
    };
    
    // public
    var service = {};
    service.next = function(request, response) {
        var body = request.body;
        var time;
        if(body.time === undefined) {
            time = new Date();
        } else {
            time = new Date(Date.parse(body.time));
        }
        var offset;
        if(body.offset === undefined) {
            offset = 420; // UTC -0700 (PDT)
        } else {
            offset = Number(body.offset);
        }
        var stop = closest(body.latitude, body.longitude);
        var result = next(stop, time, offset, body.snow);
        response.send(
            {
                time: result.time,
                wait: result.wait,
                stop: `${stop.id}: ${stop.value.name}`
            }
        );
        return;
    };

    return service;
};
