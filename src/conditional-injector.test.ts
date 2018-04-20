import {Container, Injectable} from "./conditional-injector";
import {Scope} from "./options";

describe('ConditionalInjector', function() {

    it('should inject object correctly', function() {
        class ParentClass {};
        @Injectable({predicate: (argument: string) => argument == "object"})
        class SubClass extends ParentClass {}

        @Injectable({predicate: (argument: string) => argument == "someOtherValue"})
        class SomeSubClass extends ParentClass {}

        const sub = Container.subclassesOf(ParentClass).create("object");
        const some = Container.subclassesOf(ParentClass).create("someOtherValue");

        expect(sub).toBeInstanceOf(SubClass);
        expect(some).toBeInstanceOf(SomeSubClass);
    });

    it('should inject null if no Null is given and no factory function returns true', function() {
        class ParentClass {};
        const injected = Container.subclassesOf(ParentClass).create("wrong");

        expect(injected).toBeNull();
    });

    it('should inject last added DefaultObject', function() {
        class ParentClass {};
        @Injectable()
        class DefaultClass extends ParentClass {}

        @Injectable()
        class AnotherDefaultClass extends ParentClass {}

        const injected = Container.subclassesOf(ParentClass).create("wrong");
        expect(injected).toBeInstanceOf(AnotherDefaultClass);
    });

    it('should inject DefaultObject if it does no predicate is satisfied', function() {
        class ParentClass {};
        @Injectable()
        class DefaultClass extends ParentClass {}

        @Injectable({predicate: () => false})
        class PredicateClass extends ParentClass {}

        const injected = Container.subclassesOf(ParentClass).create();
        expect(injected).toBeInstanceOf(DefaultClass);
    });

    it('should inject last DefaultObject if more than one is given', function() {
        class ParentClass {};
        @Injectable()
        class DefaultClass extends ParentClass {}

        @Injectable()
        class PredicateClass extends ParentClass {}

        const injected = Container.subclassesOf(ParentClass).create();
        expect(injected).toBeInstanceOf(PredicateClass);
    });

    it('should inject every DefaultObject in create All', function() {
        class DefaultParentClass {};
        @Injectable()
        class DefaultClass extends DefaultParentClass {}

        @Injectable()
        class PredicateClass extends DefaultParentClass {}

        const injectedList = Container.subclassesOf(DefaultParentClass).createAll();
        expect(injectedList.length).toBe(2);
    });

    it('should return different instances if not singleton', function() {
        class ParentClass {};
        @Injectable()
        class NotSingletonClass extends ParentClass {
            public value: number = 0;
        }

        const firstInjection = Container.subclassesOf(ParentClass).create();
        const secondInjection = Container.subclassesOf(ParentClass).create();

        (<NotSingletonClass>firstInjection).value = 2;
        expect((<NotSingletonClass>secondInjection).value).toBe(0)
    });

    it('default options should be NotSingleton and NoPredicate', function() {
        class ParentClass {};
        @Injectable()
        class NotSingletonClass extends ParentClass {
            public value: number = 0;
        }

        const firstInjection = Container.subclassesOf(ParentClass).create();
        const secondInjection = Container.subclassesOf(ParentClass).create();

        (<NotSingletonClass>firstInjection).value = 2;
        expect((<NotSingletonClass>secondInjection).value).toBe(0)
    });

    it('should return same instance if singleton', function() {
        class SingletonParentClass {};
        @Injectable({scope: Scope.Singleton})
        class SingletonClass extends SingletonParentClass {
            public value: number = 0;
        }

        const firstInjection = Container.subclassesOf(SingletonParentClass).create();
        const secondInjection = Container.subclassesOf(SingletonParentClass).create();

        (firstInjection as SingletonClass).value = 2;
        expect((<SingletonClass>secondInjection).value).toBe(2);
    });

    it('should return null if no superclass is registered', function() {
        class NoSubClassSuperClass {};

        const injection = Container.subclassesOf(NoSubClassSuperClass).create();
        expect(injection).toBeNull();
    });

    it('should instantiate with given param', function() {
        const param = "param";
        class ParamSuperClass {};
        @Injectable()
        class SubParamClass extends ParamSuperClass {
            constructor(arg: any) {
                super();
                expect(arg).toBe(param);
            }
        }

        Container.subclassesOf(ParamSuperClass).create(param);
    });

    it('should handle predicate exception', function() {
        class ExceptionSuperClass {};
        @Injectable({predicate: () => {throw Error()})
        class ExceptionSubClass extends ExceptionSuperClass {}

        expect(() => Container.subclassesOf(ExceptionSuperClass).create()).not.toThrow();
    });

    it('should handle predicate runtime error', function() {
        class ExceptionSuperClass {};
        @Injectable({predicate: (argument) => argument.inexistentProperty.anotherThing})
        class ExceptionSubClass extends ExceptionSuperClass {}

        Container.subclassesOf(ExceptionSuperClass).create("")
        // expect(() => Container.get(ExceptionSuperClass).create()).not.toThrow();
    });

    it('should instantiate every subclass', function() {
        expect.extend({
            toBeTruthyWithMessage(received, errMsg) {
                const result = {
                    pass: received,
                    message: () => errMsg
                };
                return result;
            }
        });

        class ParentEveryTestClass {}
        @Injectable({predicate: () => false})
        class SubClassA extends ParentEveryTestClass {}

        @Injectable()
        class SubClassB extends ParentEveryTestClass {}

        @Injectable({scope: Scope.Singleton, predicate: (value) => value == "c"})
        class SubClassC extends ParentEveryTestClass {public c = 1;}

        let expectedClasses: Function[] = ["SubClassA", "SubClassB", "SubClassC"];

        const injectedList: ParentEveryTestClass[] = Container.subclassesOf(ParentEveryTestClass).createAll({anyStuff: "blahBlah"});

        injectedList.map(injected => {
            const indexOfClassName = expectedClasses.indexOf(injected.constructor.name);
            expect(indexOfClassName > -1).toBeTruthyWithMessage(`${injected.constructor.name} is not a class of the following list: ${expectedClasses}`);
            expectedClasses.splice(indexOfClassName, 1);
        });

        const firstC: ParentEveryTestClass = Container.subclassesOf(ParentEveryTestClass).create("c");
        expect(firstC).toBeInstanceOf(SubClassC);
        (firstC as SubClassC).c = 3;

        const secondC: SubClassC = injectedList.filter(injected => injected.constructor.name == "SubClassC")[0];
        expect(secondC.c).toBe(3);

    });

});