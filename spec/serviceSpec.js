describe('Service', function() {
    var service = require('../local_modules/service')();
    it('next() returns "08:33" when stop is "A" and time is "2016-10-13T08:10:00"', function() {
        var request = {
                body: {
                    "stop": "A",
                    "time": "2016-10-13T08:10:00",
                    "snow": false
                }
            };
        service.next(request, 
            {
               send: function(result) {
                   expect(result.time).toBe('08:33');
               }
            }
        ); 
    });
});