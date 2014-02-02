Object.prototype.$ = function () {
    for (var i = 0; i < arguments.length; i++) {
        this[arguments[i][0]] = arguments[i][1];
    }
    return this;
};