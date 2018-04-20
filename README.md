# conditional-injector
It's a mix between dependency injection and factory method.
So it instantiates one of the subclasses of a class based on an optional predicate.
```
    import {Container, Injectable, Scope} from "conditional-injector";
        
    class ParentClass {
        public argumentReceived: string = "";
        constructor(argument: string) {
            this.argumentReceived = argument;
        }
    };
    
    @Injectable({predicate: (argument: string) => argument == "first"})
    class FirstSubClass extends ParentClass {
        constructor(argument: string) {
            super(argument)
        }
    }
    
    @Injectable({predicate: (argument: string) => argument == "second"})
    class SecondSubClass extends ParentClass {
        constructor(argument: string) {
            super(argument)
        }
    }
    
    console.log(Container.subclassesOf(ParentClass).create("first").argumentReceived); //"first"
    console.log(Container.subclassesOf(ParentClass).create("second").argumentReceived); //"second" 
```
**'predicate**' value it's not required and the class will be instantiated every time that no other 'predicate' is satisfied.
It fits like a glove to achieve [NullObject](https://en.wikipedia.org/wiki/Null_object_pattern) implementation:
```
    class NoPredicateParentClass {}
    
    @Injectable()
    class NoPredicateSubClass extends NoPredicateParentClass {
        constructor() {
            super();
            console.log("NoPredicateSubClass was instantiated");
        }
    }
    
    @Injectable({predicate: () => false})
    class UnsatisfiedPredicateSubClass extends NoPredicateParentClass {}
    
    Container.subclassesOf(NoPredicateParentClass).create(); // "NoPredicateSubClass was instantiated"
```
Other than this, you can define instantiation scope.
You can get a new instance in every **Request** or use the same instance throughout the entire **Application**.  
```
    class ScopeParentClass {
        public scopeDemonstrationAttribute = "originalValue";
    }
    
    @Injectable({scope: Scope.Request, predicate: (value) => value.name == "request"})
    class RequestScopeSubClass extends ScopeParentClass {}
    
    Container.subclassesOf(ScopeParentClass).create({name: "request"}).scopeDemonstrationAttribute = "requestValue";
    console.log(Container.subclassesOf(ScopeParentClass).create({name: "request"}).scopeDemonstrationAttribute); // "originalValue"
    
    @Injectable({scope: Scope.Application, predicate: (value) => value.name == "application"})
    class ApplicationScopeSubClass extends ScopeParentClass {}
    
    Container.subclassesOf(ScopeParentClass).create({name: "application"}).scopeDemonstrationAttribute = "applicationValue";
    console.log(Container.subclassesOf(ScopeParentClass).create({name: "application"}).scopeDemonstrationAttribute); // "applicationValue"
```
If you want to, you can get every subclass instance of a given class:
*It includes those with no predicate*.
```
    Container.subclassesOf(ScopeParentClass)
             .createAll()
             .map(scopeSubclass => console.log(scopeSubclass.scopeDemonstrationAttribute));
     // "originalValue" 
     // "applicationValue"
``` 
#####Note: 
You need to enable typescript flags 'experimentalDecorators' and 'emitDecoratorMetadata'.