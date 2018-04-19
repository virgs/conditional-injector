import * as Options from "./options";
export interface Injectable {
    name: string;
    options: Options.Options;
    constructor: ObjectConstructor;
    singletonInstance?: any;
}
export declare class ParentClassContainer {
    private injectables;
    private default;
    private defaultSingletonInstance?;
    create: (argument?: any) => any;
    createAll: (argument: any) => any[];
    addInjectable: (injectable: Injectable) => any;
}
