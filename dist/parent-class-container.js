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
class ParentClassContainer {
    constructor() {
        this.injectables = {};
        this.create = (argument) => {
            for (const injectable in this.injectables) {
                const factoryPredicate = this.injectables[injectable].options.predicate;
                if (factoryPredicate && factoryPredicate(argument)) {
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
            if (injectable.options.creation == Options.Creation.Default) {
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
