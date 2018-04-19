"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("./container");
const options_1 = require("./options");
function Injectable(options) {
    return function (constructor) {
        var superClassName = Object.getPrototypeOf(constructor.prototype).constructor.name;
        const className = constructor.prototype.constructor.name;
        const injectableContainer = container_1.Container.getSuperClassContainer(superClassName);
        let mergedOption = options_1.createdDefaultOption(options);
        injectableContainer
            .addInjectable({
            name: className,
            constructor: constructor,
            options: mergedOption
        });
    };
}
exports.Injectable = Injectable;
