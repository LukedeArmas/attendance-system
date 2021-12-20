// Allows async errors (mongoose) to be caught so it can be sent to our error handling middleware
module.exports = function asyncError(fn) {
    return function(req, res, next) {
        fn(req, res, next)
        .catch(e => console.log("We have an error", next(e)))
    }
}
