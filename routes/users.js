function isInt(value) {
    return value !== null && 
           parseInt(Number(value)) == value && 
           !isNaN(parseInt(value, 10));
}

module.exports = function(app) {
    
}