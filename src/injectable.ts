import {ParentClassContainer} from "./parent-class-container";
import {Container} from "./container";
import {createdDefaultOption, Options} from "./options";

export function Injectable(options?: Options) {
    return function(constructor: any) {
        var superClassName = Object.getPrototypeOf(constructor.prototype).constructor.name;
        const className = constructor.prototype.constructor.name;
        const injectableContainer: ParentClassContainer = Container.getSuperClassContainer(superClassName);

        let mergedOption = createdDefaultOption(options);
        injectableContainer
            .addInjectable(
                {
                    name: className,
                    constructor: constructor,
                    options: mergedOption
                });
    };
}