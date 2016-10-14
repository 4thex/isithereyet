module.exports = function() {
  var location = {};
  location.closest = (own, others) => {
    return others[0];  
  };
  return location;
};