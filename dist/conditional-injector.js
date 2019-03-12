"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Options = __importStar(require("./options"));
let injectableContainer = {};
class ParentClassContainer {
    constructor() {
        this.predicatesList = [];
        this.defaultList = [];
        this.create = (argument) => {
            for (const injectable of this.predicatesList) {
                const factoryPredicate = injectable.options.predicate;
                if (!factoryPredicate) {
                    continue;
                }
                let factoryPredicateResult = false;
                try {
                    factoryPredicateResult = factoryPredicate(argument);
                }
                catch (err) {
                    throw new Error(`Error executing factory predicate of ${injectable.name}: ${err}`);
                }
                if (factoryPredicateResult) {
                    return this.instantiateInjectable(injectable, argument);
                }
            }
            if (this.defaultList.length > 0) {
                const lastAddedDefault = this.defaultList[this.defaultList.length - 1];
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
                this.predicatesList.push(injectable);
            }
            return injectable;
        };
        this.log = () => {
            console.log(`\t\tPredicates list: ${this.predicatesList.map((injectable) => injectable.name).join('; ')}`);
            console.log(`\t\tDefault list: ${this.defaultList.map((injectable) => injectable.name).join('; ')}`);
        };
    }
    instantiateInjectable(injectable, argument) {
        try {
            if (injectable.singletonInstance) {
                return injectable.singletonInstance;
            }
            else if (injectable.options.scope == Options.Scope.Application) {
                injectable.singletonInstance = new injectable.constructor(argument);
                return injectable.singletonInstance;
            }
            else {
                return new injectable.constructor(argument);
            }
        }
        catch (err) {
            throw new Error(`Error instantiating object of ${injectable.name}: ${err}`);
        }
    }
}
exports.ParentClassContainer = ParentClassContainer;
class Container {
    static subclassesOf(superClass) {
        const superClassName = superClass.prototype.constructor.name;
        return injectableContainer[superClassName] || { create: () => null };
    }
    static logTree() {
        console.log(`Container`);
        for (let superClassName in injectableContainer) {
            console.log(`\tSuperclass: ${superClassName}`);
            injectableContainer[superClassName].log();
        }
    }
}
exports.Container = Container;
const getSuperClassContainer = (superClassName) => {
    if (!injectableContainer[superClassName]) {
        injectableContainer[superClassName] = new ParentClassContainer();
    }
    return injectableContainer[superClassName];
};
function Injectable(options) {
    return function (constructor) {
        const superClassName = Object.getPrototypeOf(constructor.prototype).constructor.name;
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
