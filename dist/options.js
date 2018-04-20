"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Scope;
(function (Scope) {
    Scope[Scope["Singleton"] = 1] = "Singleton";
    Scope[Scope["Request"] = 2] = "Request";
})(Scope = exports.Scope || (exports.Scope = {}));
;
function createdDefaultOption(option) {
    if (!option)
        return {
            scope: Scope.Request
        };
    return {
        scope: option.scope || Scope.Request,
        predicate: option.predicate
    };
}
exports.createdDefaultOption = createdDefaultOption;
