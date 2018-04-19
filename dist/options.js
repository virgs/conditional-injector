"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Scope;
(function (Scope) {
    Scope[Scope["Singleton"] = 1] = "Singleton";
    Scope[Scope["Request"] = 2] = "Request";
})(Scope = exports.Scope || (exports.Scope = {}));
;
var Creation;
(function (Creation) {
    Creation[Creation["Multi"] = 1] = "Multi";
    Creation[Creation["Default"] = 2] = "Default";
})(Creation = exports.Creation || (exports.Creation = {}));
;
function createdDefaultOption(option) {
    if (!option)
        return {
            scope: Scope.Request,
            creation: Creation.Default
        };
    let defaultOption = {
        scope: option.scope || Scope.Request
    };
    if (option.creation)
        defaultOption.creation = option.creation;
    else if (option.predicate)
        defaultOption.predicate = option.predicate;
    else
        defaultOption.creation = Creation.Default;
    return defaultOption;
}
exports.createdDefaultOption = createdDefaultOption;
