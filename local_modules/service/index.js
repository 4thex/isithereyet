module.exports = function() {
    // private
    var schedule = require('./schedule.json');
    
    /**
     * @param {string} stop The ID in the schedule of the bus stop
     * @param {date} time The date and time to compare to
     * @param {boolean} snow Indicates if using the snow schedule
     */
    var next = function(stop, time, snow) {
        // Convert time to minutes since midnight
        var msm = time.getHours()*60+time.getMinutes();
        // Determine if we should look in weekdays, saturdays, or snowdays
        var day = time.getDay();
        var stopSchedule = schedule[stop];
        if(day == 0) {
            // Sunday with no bus
            throw "Today is Sunday. There are no busses.";
        } else if(day < 6) {
            // It's a weekday
            times = stopSchedule.arrivals.weekdays;
        } else {
            // It's Saturday
            times = stopSchedule.arrivals.saturdays;
        }
        // Find the time in schedule that is next higher than time
        return times.find(function(stopTimeString) {
            var parts = stopTimeString.split(':');
            var stopMsm = Number(parts[0])*60+Number(parts[1]);
            return stopMsm > msm;
        });
    }
    
    // public
    var service = {};
    service.next = function(request, response) {
        var body = request.body;
        var time = new Date(Date.parse(body.time));
        var result = next(body.stop, time, body.snow);
        response.send(
            {
                time: result
            }
        );
        return;
    };
    return service;
};
