import * as Options from './options';
declare type Injectable = {
    name: string;
    options: Options.Options;
    constructor: ObjectConstructor;
    singletonInstance?: any;
};
export declare class ParentClassContainer {
    private predicatesList;
    private defaultList;
    create: (argument?: any) => any;
    createAll: (argument?: any) => any[];
    private instantiateInjectable;
    addInjectable: (injectable: Injectable) => Injectable;
    log: () => void;
}
export declare class Container {
    static subclassesOf(superClass: any): ParentClassContainer;
    static logTree(): void;
}
export declare function Injectable(options?: Options.Options): (constructor: any) => void;
export {};
