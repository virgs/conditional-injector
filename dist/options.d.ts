export declare type Options = {
    scope?: Scope;
    creation?: Creation;
    predicate?: Predicate;
};
export declare enum Scope {
    Singleton = 1,
    Request = 2,
}
export declare enum Creation {
    Multi = 1,
    Default = 2,
}
export declare type Predicate = (argument: any) => boolean;
export declare function createdDefaultOption(option?: Options): any;
