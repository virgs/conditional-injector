import {Injectable} from "./injectable";
import {Container} from "./container";
import {Creation, Scope} from "./options";

describe('Injector', function() {

    it('should inject object correctly', function() {
        class ParentClass {};
        @Injectable({predicate: (argument: string) => argument == "object"})
        class SubClass extends ParentClass {}

        @Injectable({predicate: (argument: string) => argument == "someOtherValue"})
        class SomeSubClass extends ParentClass {}

        const sub = Container.get(ParentClass).create("object");
        const some = Container.get(ParentClass).create("someOtherValue");

        expect(sub).toBeInstanceOf(SubClass);
        expect(some).toBeInstanceOf(SomeSubClass);
    });

    it('should inject null if no Null is given and no factory function returns true', function() {
        class ParentClass {};
        const injected = Container.get(ParentClass).create("wrong");

        expect(injected).toBeNull();
    });

    it('should inject last added DefaultObject', function() {
        class ParentClass {};
        @Injectable({creation: Creation.Default})
        class DefaultClass extends ParentClass {}

        @Injectable({creation: Creation.Default})
        class AnotherDefaultClass extends ParentClass {}

        const injected = Container.get(ParentClass).create("wrong");
        expect(injected).toBeInstanceOf(AnotherDefaultClass);
    });

    it('should inject DefaultObject if it does not succeed', function() {
        class ParentClass {};
        @Injectable({creation: Creation.Default})
        class DefaultClass extends ParentClass {}

        @Injectable({predicate: () => false})
        class PredicateClass extends ParentClass {}

        const injected = Container.get(ParentClass).create();
        expect(injected).toBeInstanceOf(DefaultClass);
    });

    it('should return different instances if not singleton', function() {
        class ParentClass {};
        @Injectable()
        class NotSingletonClass extends ParentClass {
            public value: number = 0;
        }

        const firstInjection = Container.get(ParentClass).create();
        const secondInjection = Container.get(ParentClass).create();

        (<NotSingletonClass>firstInjection).value = 2;
        expect((<NotSingletonClass>secondInjection).value).toBe(0)
    });

    it('default options should be NotSingleton and WithNoPredicate', function() {
        class ParentClass {};
        @Injectable()
        class NotSingletonClass extends ParentClass {
            public value: number = 0;
        }

        const firstInjection = Container.get(ParentClass).create();
        const secondInjection = Container.get(ParentClass).create();

        (<NotSingletonClass>firstInjection).value = 2;
        expect((<NotSingletonClass>secondInjection).value).toBe(0)
    });

    it('should return same instance if singleton', function() {
        class SingletonParentClass {};
        @Injectable({scope: Scope.Singleton})
        class SingletonClass extends SingletonParentClass {
            public value: number = 0;
        }

        const firstInjection = Container.get(SingletonParentClass).create();
        const secondInjection = Container.get(SingletonParentClass).create();

        (firstInjection as SingletonClass).value = 2;
        expect((<SingletonClass>secondInjection).value).toBe(2);
    });

    it('should instantiate every subclass', function() {
        expect.extend({
            toContainInstanceOfAny(instanceList, classList) {
                for (const instance of instanceList) {
                    let instanceOfSome = true;
                    for (const clazz of classList) {
                        instanceOfSome = (instance instanceof clazz);
                        if (instanceOfSome)
                            break;
                    }
                    if (!instanceOfSome)
                        return {
                            message: () => (`${this.utils.printReceived(instance)} is not an instance of any class of the list ${this.utils.printExpected(classList)}`),
                            pass: false
                        }
                }

                return {
                    message: () => (`OK`),
                    pass: true
                }
            }
        })

        class ParentEveryTestClass {}
        @Injectable({predicate: () => false})
        class SubClassA extends ParentEveryTestClass {}

        @Injectable()
        class SubClassB extends ParentEveryTestClass {}

        @Injectable({scope: Scope.Singleton, predicate: (value) => value == "c"})
        class SubClassC extends ParentEveryTestClass {public c = 1;}

        const injectedList: ParentEveryTestClass[] = Container.get(ParentEveryTestClass).createAll({anyStuff: "blahBlah"});
        expect(injectedList).toContainInstanceOfAny([SubClassA, SubClassB, SubClassC]);

        const firstC: ParentEveryTestClass = Container.get(ParentEveryTestClass).create("c");
        expect(firstC).toBeInstanceOf(SubClassC);

        (firstC as SubClassC).c = 3;
        const secondC: ParentEveryTestClass = Container.get(ParentEveryTestClass).create("c");
        expect((secondC as SubClassC).c).toBe(3);

    });

});