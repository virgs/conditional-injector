import * as Options from "./options";
export declare class Container {
    static subclassesOf(superClass: any): ParentClassContainer;
}
export declare function Injectable(options?: Options.Options): (constructor: any) => void;
export interface Injectable {
    name: string;
    options: Options.Options;
    constructor: ObjectConstructor;
    singletonInstance?: any;
}
export declare class ParentClassContainer {
    private injectables;
    private default?;
    create: (argument?: any) => any;
    createAll: (argument: any) => any[];
    addInjectable: (injectable: Injectable) => any;
}
