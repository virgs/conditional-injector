"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Scope;
(function (Scope) {
    Scope[Scope["Application"] = 1] = "Application";
    Scope[Scope["Request"] = 2] = "Request";
})(Scope = exports.Scope || (exports.Scope = {}));
function completeAttributes(option) {
    const defaultOption = { scope: Scope.Request };
    if (!option) {
        return defaultOption;
    }
    return {
        scope: option.scope || defaultOption.scope,
        predicate: option.predicate
    };
}
exports.completeAttributes = completeAttributes;
