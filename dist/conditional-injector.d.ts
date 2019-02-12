import * as Options from './options';
export declare class ParentClassContainer {
    private predicatesList;
    private defaultList;
    create: (argument?: any) => any;
    createAll: (argument?: any) => any[];
    private instantiateInjectable(injectable, argument);
    addInjectable: (injectable: {
        name: string;
        options: Options.Options;
        constructor: ObjectConstructor;
        singletonInstance?: any;
    }) => {
        name: string;
        options: Options.Options;
        constructor: ObjectConstructor;
        singletonInstance?: any;
    };
    log: () => void;
}
export declare class Container {
    static subclassesOf(superClass: any): ParentClassContainer;
    static logTree(): void;
}
export declare function Injectable(options?: Options.Options): (constructor: any) => void;
