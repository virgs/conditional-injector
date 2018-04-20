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
        let mergedOption = Options.createdDefaultOption(options);
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
        this.injectables = {};
        this.create = (argument) => {
            for (const injectable in this.injectables) {
                const factoryPredicate = this.injectables[injectable].options.predicate;
                let predicateResult = false;
                try {
                    predicateResult = factoryPredicate(argument);
                }
                catch (err) { }
                if (factoryPredicate && predicateResult) {
                    if (this.injectables[injectable].singletonInstance) {
                        return this.injectables[injectable].singletonInstance;
                    }
                    else if (this.injectables[injectable].options.scope == Options.Scope.Singleton) {
                        this.injectables[injectable].singletonInstance = new this.injectables[injectable].constructor(argument);
                        return this.injectables[injectable].singletonInstance;
                    }
                    else {
                        return new this.injectables[injectable].constructor(argument);
                    }
                }
            }
            if (this.default) {
                if (this.default.singletonInstance) {
                    return this.default.singletonInstance;
                }
                else if (this.default.options.scope == Options.Scope.Singleton) {
                    this.default.singletonInstance = new this.default.constructor(argument);
                    return this.default.singletonInstance;
                }
                else {
                    return new this.default.constructor(argument);
                }
            }
            return null;
        };
        this.createAll = (argument) => {
            let returnList = [];
            for (const injectable in this.injectables) {
                returnList.push(new this.injectables[injectable].constructor(argument));
            }
            return returnList;
        };
        this.addInjectable = (injectable) => {
            if (!injectable.options.predicate) {
                this.default = injectable;
            }
            else {
                if (this.injectables[injectable.name])
                    return null;
                this.injectables[injectable.name] = injectable;
            }
            return injectable;
        };
    }
}
exports.ParentClassContainer = ParentClassContainer;
