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
    if (!option)
        return {
            scope: Scope.Request
        }

    return {
        scope: option.scope || Scope.Request,
        predicate: option.predicate
    };
}
