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

console.log(Container.subclassesOf(ParentClass).create("first").argumentReceived);
console.log(Container.subclassesOf(ParentClass).create("second").argumentReceived);
//---------------
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

Container.subclassesOf(NoPredicateParentClass).create(); // "No predicateSubClass was instantiated"

// ---------------
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

Container.subclassesOf(ScopeParentClass).createAll()
    .map(scopeSubclass => console.log(scopeSubclass.scopeDemonstrationAttribute)); // "applicationValue"
