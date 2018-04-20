export declare type Options = {
    scope?: Scope;
    predicate?: Predicate;
};
export declare enum Scope {
    Singleton = 1,
    Request = 2,
}
export declare type Predicate = (argument: any) => boolean;
export declare function completeAttributes(option?: Options): Options;
