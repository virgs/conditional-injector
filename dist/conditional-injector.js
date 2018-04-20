"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const Options = __importStar(require("./options"));
let injectableContainer = {};
class Container {
    static subclassesOf(superClass) {
        const superClassName = superClass.prototype.constructor.name;
        return injectableContainer[superClassName] || { create: () => null };
    }
}
exports.Container = Container;
const getSuperClassContainer = (superClassName) => {
    if (!injectableContainer[superClassName])
        injectableContainer[superClassName] = new ParentClassContainer();
    return injectableContainer[superClassName];
};
function Injectable(options) {
    return function (constructor) {
        var superClassName = Object.getPrototypeOf(constructor.prototype).constructor.name;
        const className = constructor.prototype.constructor.name;
        const injectableContainer = getSuperClassContainer(superClassName);
        let mergedOption = Options.completeAttributes(options);
        injectableContainer
            .addInjectable({
            name: className,
            constructor: constructor,
            options: mergedOption
        });
    };
}
exports.Injectable = Injectable;
class ParentClassContainer {
    constructor() {
        this.predicatesList = [];
        this.defaultList = [];
        this.create = (argument) => {
            for (const injectable of this.predicatesList) {
                const factoryPredicate = injectable.options.predicate;
                if (!factoryPredicate)
                    continue;
                try {
                    if (factoryPredicate(argument)) {
                        return this.instantiateInjectable(injectable, argument);
                    }
                }
                catch (err) { }
            }
            if (this.defaultList.length > 0) {
                let lastAddedDefault = this.defaultList[this.defaultList.length - 1];
                return this.instantiateInjectable(lastAddedDefault, argument);
            }
            return null;
        };
        this.createAll = (argument) => {
            let returnList = [];
            for (const injectable of this.predicatesList) {
                returnList.push(this.instantiateInjectable(injectable, argument));
            }
            for (const injectable of this.defaultList) {
                returnList.push(this.instantiateInjectable(injectable, argument));
            }
            return returnList;
        };
        this.addInjectable = (injectable) => {
            if (!injectable.options.predicate) {
                this.defaultList.push(injectable);
            }
            else {
                // if (this.predicatesList[injectable.name])
                //     return null;
                this.predicatesList.push(injectable);
            }
            return injectable;
        };
    }
    instantiateInjectable(injectable, argument) {
        if (injectable.singletonInstance) {
            return injectable.singletonInstance;
        }
        else if (injectable.options.scope == Options.Scope.Singleton) {
            injectable.singletonInstance = new injectable.constructor(argument);
            return injectable.singletonInstance;
        }
        else {
            return new injectable.constructor(argument);
        }
    }
}
exports.ParentClassContainer = ParentClassContainer;
