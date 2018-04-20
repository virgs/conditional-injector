export type Options = {
    scope?: Scope;
    predicate?: Predicate;
}

export enum Scope {
    Singleton = 1,
    Request = 2
};

export type Predicate = (argument: any) => boolean;


export function createdDefaultOption(option?: Options): Options {
    const defaultOption: Options = { scope: Scope.Request}
    if (!option)
        return defaultOption;
    return {
        scope: option.scope || defaultOption.scope,
        predicate: option.predicate  || defaultOption.predicate
    };
}
