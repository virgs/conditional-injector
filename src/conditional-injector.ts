import * as Options from './options';

let injectableContainer: any = {};

type Injectable = {
    name: string;
    options: Options.Options;
    constructor: ObjectConstructor;
    singletonInstance?: any;
};

export class ParentClassContainer {

    private predicatesList: Injectable[] = [];
    private defaultList: Injectable[] = [];

    public create = (argument?: any): any => {
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
    }

    public createAll = (argument?: any): any[] => {
        let returnList = [];
        for (const injectable of this.predicatesList) {
            returnList.push(this.instantiateInjectable(injectable, argument));
        }
        for (const injectable of this.defaultList) {
            returnList.push(this.instantiateInjectable(injectable, argument));
        }
        return returnList;
    }

    private instantiateInjectable(injectable: Injectable, argument: any): any {
        try {
            if (injectable.singletonInstance) {
                return injectable.singletonInstance;
            } else if (injectable.options.scope == Options.Scope.Application) {
                injectable.singletonInstance = new injectable.constructor(argument);
                return injectable.singletonInstance;
            } else {
                return new injectable.constructor(argument);
            }
        }
        catch (err) {
            throw new Error(`Error instantiating object of ${injectable.name}: ${err}`);
        }

    }

    public addInjectable = (injectable: Injectable): Injectable => {
        if (!injectable.options.predicate) {
            this.defaultList.push(injectable);
        } else {
            this.predicatesList.push(injectable);
        }
        return injectable;
    }

    public log = (): void => {
        console.log(`\t\tPredicates list: ${this.predicatesList.map((injectable: Injectable) => injectable.name).join('; ')}`);
        console.log(`\t\tDefault list: ${this.defaultList.map((injectable: Injectable) => injectable.name).join('; ')}`);
    }
}

export class Container {
    public static subclassesOf(superClass: any): ParentClassContainer {
        const superClassName: string = superClass.prototype.constructor.name;
        return injectableContainer[superClassName] || {create: () => null};
    }

    public static logTree(): void {
        console.log(`Container`);
        for (let superClassName in injectableContainer) {
            console.log(`\tSuperclass: ${superClassName}`);
            injectableContainer[superClassName].log();
        }
    }
}

const getSuperClassContainer = (superClassName: string): any => {
    if (!injectableContainer[superClassName]) {
        injectableContainer[superClassName] = new ParentClassContainer();
    }
    return injectableContainer[superClassName];
};

export function Injectable(options?: Options.Options) {
    return function (constructor: any) {
        const superClassName = Object.getPrototypeOf(constructor.prototype).constructor.name;
        const className = constructor.prototype.constructor.name;
        const injectableContainer: ParentClassContainer = getSuperClassContainer(superClassName);

        let mergedOption = Options.completeAttributes(options);
        injectableContainer
            .addInjectable(
                {
                    name: className,
                    constructor: constructor,
                    options: mergedOption
                });
    };
}
