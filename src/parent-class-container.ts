import * as Options from "./options";

export interface Injectable {
    name: string;
    options: Options.Options;
    constructor: ObjectConstructor;
    singletonInstance?: any;
}

export class ParentClassContainer {

    private injectables: any = {};
    private default: any = null;
    private defaultSingletonInstance?: any;

    public create = (argument?: any): any => {
        for (const injectable in this.injectables) {
            const factoryPredicate = this.injectables[injectable].options.predicate;
            if (factoryPredicate && factoryPredicate(argument)) {
                if (this.injectables[injectable].singletonInstance) {
                    return this.injectables[injectable].singletonInstance;

                }
                else if (this.injectables[injectable].options.scope == Options.Scope.Singleton) {
                    this.injectables[injectable].singletonInstance = new this.injectables[injectable].constructor(argument);
                    return this.injectables[injectable].singletonInstance;
                } else {
                    return new this.injectables[injectable].constructor(argument);
                }
            }

        }
        if (this.default) {
            if (this.defaultSingletonInstance) {
                return this.defaultSingletonInstance;
            }
            else if (this.default.options.scope == Options.Scope.Singleton) {
                this.defaultSingletonInstance = new this.default.constructor(argument);
                return this.defaultSingletonInstance;
            } else {
                return new this.default.constructor(argument);
            }
        }
        return null;
    }

    public createAll = (argument: any): any[] => {
        let returnList = [];
        for (const injectable in this.injectables) {
            returnList.push(new this.injectables[injectable].constructor(argument));
        }
        return returnList;
    }

    public addInjectable = (injectable: Injectable): any => {
        if (injectable.options.creation == Options.Creation.Default) {
            this.default = injectable;
        }
        else {
            if (this.injectables[injectable.name])
                return null;
            this.injectables[injectable.name] = injectable;
        }
        return injectable;
    }
}
