/**
 * Quiz Bank — multiple choice questions by topic.
 * Used in Round 2 of the interview.
 */

export const QUIZ_QUESTIONS = {
  javascript: [
    {
      q: "What does `typeof null` return in JavaScript?",
      options: ["null", "undefined", "object", "string"],
      answer: 2,
      explanation:
        'typeof null returns "object" — a well-known bug in JavaScript that has never been fixed for backward compatibility.',
    },
    {
      q: "Which method creates a shallow copy of an array?",
      options: [
        "array.clone()",
        "array.slice()",
        "array.copy()",
        "array.duplicate()",
      ],
      answer: 1,
      explanation:
        "array.slice() with no arguments returns a shallow copy of the entire array.",
    },
    {
      q: "What is the output of `[] + []`?",
      options: ["[]", "0", '""', "undefined"],
      answer: 2,
      explanation:
        'Both arrays are coerced to empty strings, so the result is "" (empty string).',
    },
    {
      q: "What does the `===` operator check?",
      options: [
        "Value only",
        "Type only",
        "Value and type",
        "Reference equality",
      ],
      answer: 2,
      explanation:
        "=== checks both value and type (strict equality), unlike == which performs type coercion.",
    },
    {
      q: "Which is NOT a JavaScript primitive type?",
      options: ["string", "boolean", "array", "symbol"],
      answer: 2,
      explanation:
        "Array is an object type in JavaScript. Primitives are: string, number, bigint, boolean, undefined, symbol, null.",
    },
    {
      q: "What does `Promise.all([])` return?",
      options: [
        "undefined",
        "null",
        "A rejected promise",
        "A resolved promise with []",
      ],
      answer: 3,
      explanation:
        "Promise.all([]) immediately resolves with an empty array since there are no promises to wait for.",
    },
    {
      q: "What is event delegation in JavaScript?",
      options: [
        "Removing event listeners automatically",
        "Attaching an event to a parent to handle events from children",
        "Preventing events from bubbling up",
        "Running events asynchronously",
      ],
      answer: 1,
      explanation:
        "Event delegation uses event bubbling to handle events on a parent element instead of attaching individual listeners to each child.",
    },
    {
      q: "What does the `Array.prototype.reduce()` method do?",
      options: [
        "Filters array elements",
        "Sorts array elements",
        "Executes a reducer function accumulating a single result",
        "Maps each element to a new value",
      ],
      answer: 2,
      explanation:
        "reduce() applies a function to an accumulator and each element, resulting in a single output value.",
    },
  ],

  react: [
    {
      q: "What hook is used to perform side effects in a React function component?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      answer: 1,
      explanation:
        "useEffect runs side effects (data fetching, subscriptions, DOM mutations) after rendering.",
    },
    {
      q: "What is the Virtual DOM in React?",
      options: [
        "A direct copy of the real DOM",
        "A lightweight in-memory representation of the real DOM",
        "A CSS-in-JS solution",
        "A server-side rendering technique",
      ],
      answer: 1,
      explanation:
        "React maintains a Virtual DOM — a lightweight copy it uses to diff and batch updates before touching the real DOM.",
    },
    {
      q: "Which of these correctly describes React keys?",
      options: [
        "They must be globally unique across the app",
        "They help React identify which items in a list have changed",
        "They are required on every JSX element",
        "They replace the need for state management",
      ],
      answer: 1,
      explanation:
        "Keys help React reconcile lists efficiently by identifying which items changed, were added, or removed.",
    },
    {
      q: "What does `useMemo` do?",
      options: [
        "Memoizes a callback function",
        "Stores the previous state",
        "Memoizes a computed value, recomputing only when dependencies change",
        "Prevents unnecessary re-renders of child components",
      ],
      answer: 2,
      explanation:
        "useMemo caches the result of an expensive computation and only recomputes it when its dependency array changes.",
    },
    {
      q: "In React, what is prop drilling?",
      options: [
        "Passing props through many intermediate components that do not need them",
        "Using spread operators to pass props",
        "Validating props with PropTypes",
        "Drilling into the DOM to update props",
      ],
      answer: 0,
      explanation:
        "Prop drilling refers to passing data through multiple component layers just to reach a deeply nested component that needs it.",
    },
  ],

  python: [
    {
      q: "What is the difference between a list and a tuple in Python?",
      options: [
        "Lists are ordered, tuples are not",
        "Tuples are mutable, lists are not",
        "Lists are mutable, tuples are immutable",
        "There is no difference",
      ],
      answer: 2,
      explanation:
        "Lists are mutable (can be changed after creation), while tuples are immutable (cannot be modified).",
    },
    {
      q: "What does the `*args` syntax do in a Python function?",
      options: [
        "Unpacks a dictionary",
        "Accepts any number of keyword arguments",
        "Accepts any number of positional arguments",
        "Multiplies arguments together",
      ],
      answer: 2,
      explanation:
        "*args allows a function to accept any number of positional arguments, collecting them into a tuple.",
    },
    {
      q: "What is a Python generator?",
      options: [
        "A class that creates objects",
        "A function that returns an iterator using yield",
        "A way to generate random numbers",
        "A type of list comprehension",
      ],
      answer: 1,
      explanation:
        "A generator is a function using yield to return values lazily, one at a time, saving memory for large datasets.",
    },
    {
      q: "What does `__init__` do in a Python class?",
      options: [
        "Destroys the object",
        "Imports the module",
        "Initialises a new object instance",
        "Defines a static method",
      ],
      answer: 2,
      explanation:
        "__init__ is the constructor method called when a new instance of a class is created.",
    },
    {
      q: "What is the output of `[x**2 for x in range(4)]`?",
      options: [
        "[0, 1, 4, 9]",
        "[1, 4, 9, 16]",
        "[0, 1, 2, 3]",
        "[1, 2, 3, 4]",
      ],
      answer: 0,
      explanation:
        "List comprehension squares each value in range(4) = [0,1,2,3], giving [0, 1, 4, 9].",
    },
  ],

  sql: [
    {
      q: "What is the difference between INNER JOIN and LEFT JOIN?",
      options: [
        "INNER JOIN is faster than LEFT JOIN",
        "LEFT JOIN returns all rows from the left table even if no match exists",
        "INNER JOIN returns all rows from both tables",
        "LEFT JOIN only returns unmatched rows",
      ],
      answer: 1,
      explanation:
        "LEFT JOIN returns all rows from the left table and matching rows from the right; unmatched right-side values are NULL.",
    },
    {
      q: "What does GROUP BY do in SQL?",
      options: [
        "Sorts the result set",
        "Filters rows based on a condition",
        "Groups rows sharing a value for use with aggregate functions",
        "Joins multiple tables",
      ],
      answer: 2,
      explanation:
        "GROUP BY groups rows with the same values so aggregate functions (COUNT, SUM, AVG) can be applied per group.",
    },
    {
      q: "What is the difference between WHERE and HAVING?",
      options: [
        "WHERE filters before grouping; HAVING filters after grouping",
        "HAVING filters before grouping; WHERE filters after grouping",
        "They are identical",
        "WHERE works with aggregate functions; HAVING does not",
      ],
      answer: 0,
      explanation:
        "WHERE filters rows before any aggregation; HAVING filters groups after GROUP BY has been applied.",
    },
    {
      q: "What does a database index do?",
      options: [
        "Prevents duplicate rows",
        "Enforces foreign key constraints",
        "Speeds up query lookups at the cost of write performance and storage",
        "Encrypts the table data",
      ],
      answer: 2,
      explanation:
        "An index creates a data structure that speeds up SELECT queries but adds overhead to INSERT/UPDATE/DELETE operations.",
    },
    {
      q: "What does the DISTINCT keyword do?",
      options: [
        "Sorts results in ascending order",
        "Returns only unique values in the result set",
        "Joins tables without duplicates",
        "Filters NULL values",
      ],
      answer: 1,
      explanation:
        "DISTINCT eliminates duplicate rows from the query results, returning only unique values.",
    },
  ],

  general: [
    {
      q: "What is the time complexity of binary search?",
      options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
      answer: 2,
      explanation:
        "Binary search halves the search space at each step, giving O(log n) time complexity.",
    },
    {
      q: "What does REST stand for?",
      options: [
        "Remote Execution State Transfer",
        "Representational State Transfer",
        "Request State Technology",
        "Resource Endpoint Standard Transfer",
      ],
      answer: 1,
      explanation:
        "REST (Representational State Transfer) is an architectural style for distributed hypermedia systems.",
    },
    {
      q: "What is the difference between stack and heap memory?",
      options: [
        "Stack is slower; heap is faster",
        "Stack stores global variables; heap stores local variables",
        "Stack is for static/function memory (LIFO); heap is for dynamic allocation",
        "They are interchangeable",
      ],
      answer: 2,
      explanation:
        "Stack memory is managed automatically (LIFO, fast) for function calls and local variables. Heap is for dynamic allocation managed manually or by GC.",
    },
    {
      q: "What is a race condition?",
      options: [
        "A performance benchmark between two threads",
        "When two threads compete to access shared data, causing unpredictable results",
        "A network timeout caused by high latency",
        "An algorithm that sorts data in parallel",
      ],
      answer: 1,
      explanation:
        "A race condition occurs when the outcome of a program depends on the unpredictable timing/order of concurrent operations.",
    },
    {
      q: "What does SOLID stand for in software engineering?",
      options: [
        "Single, Open, Liskov, Interface, Dependency principles",
        "Static, Object, Linked, Instance, Dynamic patterns",
        "Scalable, Optimised, Lightweight, Independent, Distributed",
        "Synchronous, Object-oriented, Layered, Integrated, Decoupled",
      ],
      answer: 0,
      explanation:
        "SOLID: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion — five OOP design principles.",
    },
    {
      q: "What is the purpose of a load balancer?",
      options: [
        "To compress network traffic",
        "To distribute incoming requests across multiple servers",
        "To cache database queries",
        "To encrypt API responses",
      ],
      answer: 1,
      explanation:
        "A load balancer distributes incoming traffic across multiple backend servers to improve availability, reliability, and performance.",
    },
    {
      q: "What is memoization?",
      options: [
        "A way to write functions with fewer lines",
        "Caching the results of expensive function calls for the same inputs",
        "Storing user preferences in a database",
        "A technique for managing memory allocation",
      ],
      answer: 1,
      explanation:
        "Memoization is an optimisation that caches function results keyed by their inputs, avoiding redundant computation.",
    },
  ],
};

// ── Additional topic-specific question banks ──────────────────────────────────

export const EXTENDED_QUIZ = {
  frontend_advanced: [
    {
      q: "What is the difference between `display: none` and `visibility: hidden` in CSS?",
      options: [
        "They are identical",
        "display:none removes the element from layout; visibility:hidden hides it but keeps the space",
        "visibility:hidden removes the element; display:none keeps the space",
        "display:none only works on block elements",
      ],
      answer: 1,
      explanation:
        "display:none removes the element from the document flow entirely. visibility:hidden makes it invisible but it still occupies space.",
    },
    {
      q: "What does the CSS `z-index` property do, and when does it have no effect?",
      options: [
        "Controls opacity; only works on transparent elements",
        "Controls stacking order; only works on positioned elements (not static)",
        "Controls layer depth; works on all elements",
        "Controls 3D perspective; requires transform",
      ],
      answer: 1,
      explanation:
        "z-index controls the stacking order of elements. It only has effect when position is relative, absolute, fixed, or sticky — not static.",
    },
    {
      q: "What is the purpose of React's `useCallback` hook?",
      options: [
        "To cache the result of an expensive calculation",
        "To run side effects after render",
        "To memoize a callback function so it doesn't recreate on every render",
        "To replace Redux for state management",
      ],
      answer: 2,
      explanation:
        "useCallback returns a memoized version of a callback that only changes if one of its dependencies changes. Useful when passing callbacks to optimised child components.",
    },
    {
      q: "In CSS Flexbox, what does `flex: 1` mean?",
      options: [
        "The element has 1px flex gap",
        "The element is the first flex child",
        "Shorthand for flex-grow:1 flex-shrink:1 flex-basis:0 — element grows to fill available space",
        "The element has 100% width",
      ],
      answer: 2,
      explanation:
        "flex:1 is shorthand for flex-grow:1, flex-shrink:1, flex-basis:0%. It makes the element grow to fill available space and shrink if needed.",
    },
    {
      q: "What is the browser's Critical Rendering Path?",
      options: [
        "The route the browser takes to find the server",
        "The sequence of steps the browser takes to convert HTML/CSS/JS into pixels on screen",
        "The order CSS rules are applied based on specificity",
        "The path JavaScript uses to reach the DOM",
      ],
      answer: 1,
      explanation:
        "The Critical Rendering Path is: Parse HTML → Build DOM → Parse CSS → Build CSSOM → Combine into Render Tree → Layout → Paint → Composite.",
    },
    {
      q: "What is a React Portal?",
      options: [
        "A way to share state between components",
        "A method to render children into a DOM node outside the parent component hierarchy",
        "A Redux middleware for async actions",
        "A way to lazy-load components",
      ],
      answer: 1,
      explanation:
        "ReactDOM.createPortal() renders children into a different DOM node (e.g. document.body), even though they're inside the React component tree. Used for modals, tooltips.",
    },
    {
      q: "What problem does CSS `contain: layout` solve?",
      options: [
        "Prevents CSS variables from leaking",
        "Limits layout calculations to within the element, improving rendering performance",
        "Forces the element to use flexbox layout",
        "Prevents child elements from inheriting styles",
      ],
      answer: 1,
      explanation:
        "CSS containment tells the browser that an element's subtree is independent, so it can optimise reflow/repaint by not recalculating outside the contained element.",
    },
    {
      q: "What is the difference between `localStorage` and `sessionStorage`?",
      options: [
        "localStorage is encrypted; sessionStorage is not",
        "localStorage persists until explicitly cleared; sessionStorage is cleared when the tab closes",
        "sessionStorage allows larger storage than localStorage",
        "They are identical — just different APIs for the same storage",
      ],
      answer: 1,
      explanation:
        "localStorage persists data with no expiration. sessionStorage data is cleared when the browser tab is closed. Both are limited to ~5MB.",
    },
  ],

  backend_advanced: [
    {
      q: "What is database connection pooling and why is it important?",
      options: [
        "Compressing database queries to reduce bandwidth",
        "Reusing a set of established connections instead of opening a new one per request, reducing overhead",
        "Distributing queries across multiple databases",
        "Caching query results in memory",
      ],
      answer: 1,
      explanation:
        "Creating a DB connection is expensive (TCP handshake, authentication). Connection pooling maintains a pool of open connections that are reused, dramatically improving throughput.",
    },
    {
      q: "What is the N+1 query problem in ORMs?",
      options: [
        "Running N queries in parallel plus one aggregation query",
        "Fetching N records then making one extra query per record — e.g. loading posts then querying author for each",
        "A database that can only handle N+1 concurrent connections",
        "Using N tables joined with 1 primary table",
      ],
      answer: 1,
      explanation:
        "N+1 happens when you fetch N records (1 query) and then for each record make another query (N queries), totalling N+1. Fixed with eager loading (JOINs or includes).",
    },
    {
      q: "What is the difference between horizontal and vertical scaling?",
      options: [
        "Horizontal adds more CPUs to one server; vertical adds more servers",
        "Vertical adds resources (CPU/RAM) to existing server; horizontal adds more servers",
        "They are the same — just different naming conventions",
        "Horizontal scales databases; vertical scales application servers",
      ],
      answer: 1,
      explanation:
        "Vertical scaling = bigger machine (more CPU/RAM). Horizontal scaling = more machines. Horizontal is generally preferred for web services as it avoids single points of failure.",
    },
    {
      q: "What is eventual consistency in distributed systems?",
      options: [
        "All nodes always have the same data at the same time",
        "Data may be temporarily inconsistent across nodes but will converge to the same state given enough time",
        "Consistency is guaranteed only after a fixed timeout",
        "Only the primary node is always consistent",
      ],
      answer: 1,
      explanation:
        "Eventual consistency means replicas may lag but will converge. Used in systems that prioritise availability over strict consistency (CAP theorem).",
    },
    {
      q: "What does idempotent mean in the context of HTTP APIs?",
      options: [
        "The request can only be made once",
        "Making the same request multiple times produces the same result as making it once",
        "The request is automatically retried on failure",
        "The response always returns the same status code",
      ],
      answer: 1,
      explanation:
        "An idempotent operation can be applied multiple times without changing the result. GET, PUT, DELETE are idempotent. POST typically is not.",
    },
    {
      q: "What is a database transaction and what are ACID properties?",
      options: [
        "A transaction is a query; ACID = Async, Cached, Indexed, Distributed",
        "A transaction is a group of operations treated as one unit; ACID = Atomicity, Consistency, Isolation, Durability",
        "ACID is a type of database encryption algorithm",
        "A transaction is a connection session; ACID ensures connection security",
      ],
      answer: 1,
      explanation:
        "ACID: Atomicity (all or nothing), Consistency (valid state before and after), Isolation (concurrent transactions don't interfere), Durability (committed data persists).",
    },
    {
      q: "What is the purpose of database indexes and what is the trade-off?",
      options: [
        "Indexes compress data; trade-off is slower reads",
        "Indexes speed up reads by creating a lookup structure; trade-off is slower writes and extra storage",
        "Indexes enforce uniqueness; no trade-off",
        "Indexes enable full-text search; trade-off is higher memory usage",
      ],
      answer: 1,
      explanation:
        "An index (like a B-tree) allows O(log n) lookups instead of O(n) scans. But every INSERT/UPDATE/DELETE must also update the index, adding write overhead.",
    },
  ],

  system_design: [
    {
      q: "In the CAP theorem, which two properties can a distributed system guarantee simultaneously?",
      options: [
        "Consistency, Availability, and Partition Tolerance — all three",
        "Only two of: Consistency, Availability, Partition Tolerance",
        "Only Consistency and Availability",
        "Only Availability and Partition Tolerance",
      ],
      answer: 1,
      explanation:
        "CAP theorem states you can only guarantee two: a system that is partition tolerant (real networks have failures) must choose between consistency (all nodes see same data) or availability (always responds).",
    },
    {
      q: "What is a CDN (Content Delivery Network) and what problem does it solve?",
      options: [
        "A type of database for content storage",
        "A network of geographically distributed servers that cache content closer to users, reducing latency",
        "A protocol for encrypting web content",
        "A load balancer that distributes requests to servers",
      ],
      answer: 1,
      explanation:
        "CDNs cache static assets (images, JS, CSS) at edge nodes close to users worldwide. This reduces round-trip time and offloads traffic from origin servers.",
    },
    {
      q: "What is the difference between a message queue and a pub/sub system?",
      options: [
        "They are identical — just different names",
        "Message queues deliver to one consumer; pub/sub delivers to all subscribers of a topic",
        "Pub/sub is synchronous; message queues are async",
        "Message queues are for databases; pub/sub is for frontends",
      ],
      answer: 1,
      explanation:
        "In a message queue (e.g. RabbitMQ), a message is consumed by one worker. In pub/sub (e.g. Kafka), a published message is delivered to all subscribers — enabling fan-out patterns.",
    },
  ],

  python_advanced: [
    {
      q: "What is the GIL (Global Interpreter Lock) in Python?",
      options: [
        "A lock that prevents all concurrency in Python",
        "A mutex that allows only one thread to execute Python bytecode at a time, limiting true thread parallelism",
        "A garbage collection mechanism",
        "A security feature that locks module imports",
      ],
      answer: 1,
      explanation:
        "The GIL prevents multiple threads from executing Python bytecode simultaneously. It protects Python objects from concurrent access but limits CPU-bound multithreading. Use multiprocessing or asyncio instead.",
    },
    {
      q: "What is a Python decorator?",
      options: [
        "A CSS-like styling system for Python UIs",
        "A function that takes a function and returns a modified version of it, using @syntax",
        "A class that inherits from another class",
        "A comment style for documentation",
      ],
      answer: 1,
      explanation:
        "A decorator is a higher-order function: @my_decorator above a function is shorthand for func = my_decorator(func). Used for logging, auth, caching, timing.",
    },
    {
      q: "What is the difference between a list and a generator in Python?",
      options: [
        "Lists are ordered; generators are unordered",
        "Lists store all values in memory; generators produce values lazily one at a time using yield",
        "Generators are faster lists that use less syntax",
        "Lists support indexing; generators do not support any operations",
      ],
      answer: 1,
      explanation:
        "A generator function uses yield and returns values one at a time on demand — never storing all values in memory. Perfect for large datasets or infinite sequences.",
    },
  ],

  java_advanced: [
    {
      q: "What is the difference between `==` and `.equals()` in Java?",
      options: [
        "They are identical",
        "== compares references; .equals() compares object content",
        ".equals() compares references; == compares content",
        "== works only on primitives; .equals() only on String",
      ],
      answer: 1,
      explanation:
        "== checks reference equality (same object in memory). .equals() checks logical equality (same content). Always use .equals() for String comparison.",
    },
    {
      q: "What is the purpose of the `final` keyword in Java?",
      options: [
        "Marks a method as abstract",
        "Prevents inheritance, overriding, or reassignment depending on context",
        "Defines a constant only",
        "Forces garbage collection",
      ],
      answer: 1,
      explanation:
        "final on a class prevents inheritance; on a method prevents overriding; on a variable prevents reassignment.",
    },
    {
      q: "What is the difference between an interface and an abstract class in Java?",
      options: [
        "Interfaces can have constructors; abstract classes cannot",
        "Abstract classes can have state and constructors; interfaces define contracts (Java 8+ allows default methods)",
        "There is no meaningful difference since Java 8",
        "Abstract classes support multiple inheritance; interfaces do not",
      ],
      answer: 1,
      explanation:
        "Abstract classes can hold state, constructors, and concrete methods. Interfaces define contracts. Java 8 added default/static methods to interfaces but they still cannot hold instance state.",
    },
    {
      q: "What does the `synchronized` keyword do in Java?",
      options: [
        "Makes a variable thread-local",
        "Ensures only one thread executes a method or block at a time",
        "Forces sequential execution across all threads globally",
        "Prevents a method from being overridden",
      ],
      answer: 1,
      explanation:
        "synchronized acquires a monitor lock on the object (or class), ensuring mutual exclusion for that block. It prevents race conditions but can cause contention.",
    },
    {
      q: "What is autoboxing in Java?",
      options: [
        "Automatically packaging a Java program as a JAR",
        "Implicit conversion between primitives and their wrapper types (e.g. int ↔ Integer)",
        "A design pattern for wrapping legacy APIs",
        "Automatic memory management for large objects",
      ],
      answer: 1,
      explanation:
        "Autoboxing is the automatic conversion of a primitive (int, double) to its wrapper class (Integer, Double) and unboxing is the reverse. Introduced in Java 5.",
    },
    {
      q: "What is the Java Stream API used for?",
      options: [
        "Reading and writing files only",
        "Functional-style operations on collections (filter, map, reduce) without modifying source",
        "Network socket communication",
        "Parallel thread management",
      ],
      answer: 1,
      explanation:
        "Streams provide a functional pipeline for processing sequences of elements: filter, map, flatMap, reduce, collect. They do not modify the source collection.",
    },
    {
      q: "What is the difference between `HashMap` and `ConcurrentHashMap`?",
      options: [
        "HashMap is faster; ConcurrentHashMap is thread-safe",
        "ConcurrentHashMap does not allow null keys; HashMap does",
        "Both are thread-safe but ConcurrentHashMap uses finer locking",
        "Both A and B are correct",
      ],
      answer: 3,
      explanation:
        "ConcurrentHashMap is thread-safe using segment-level locking (Java 7) or CAS operations (Java 8+), is faster than synchronized HashMap, and does not allow null keys or values.",
    },
    {
      q: "What is the Spring IoC container?",
      options: [
        "A build tool for Spring projects",
        "A container that manages object creation and dependency injection via configuration or annotations",
        "A web server bundled with Spring",
        "A database connection pool",
      ],
      answer: 1,
      explanation:
        "IoC (Inversion of Control) means the container creates and wires beans instead of the application doing it manually. Spring uses @Component, @Service, @Autowired etc. to manage the object graph.",
    },
  ],

  dotnet_advanced: [
    {
      q: "What is the difference between `value types` and `reference types` in C#?",
      options: [
        "Value types are stored on the heap; reference types on the stack",
        "Value types store the data directly; reference types store a pointer to data on the heap",
        "There is no difference in C# — everything is a reference",
        "Value types cannot be null; reference types always can",
      ],
      answer: 1,
      explanation:
        "Value types (int, struct, enum) store data directly on the stack. Reference types (class, string, arrays) store a heap reference. Structs are value types even when large.",
    },
    {
      q: "What does `async`/`await` do in C#?",
      options: [
        "Creates new threads for every async call",
        "Enables non-blocking asynchronous programming using the Task model without blocking threads",
        "Replaces the need for the Thread class entirely",
        "Only works with I/O operations, not CPU-bound work",
      ],
      answer: 1,
      explanation:
        "async/await uses the Task Parallel Library under the hood. await suspends the method without blocking the thread, resuming when the awaited Task completes.",
    },
    {
      q: "What is LINQ in .NET?",
      options: [
        "A linked list implementation",
        "Language Integrated Query — allows SQL-style querying over any IEnumerable data source",
        "A network communication library",
        "A logging framework",
      ],
      answer: 1,
      explanation:
        "LINQ provides query operators (Where, Select, GroupBy, Join) that work uniformly over collections, XML, databases (via Entity Framework), and more.",
    },
    {
      q: "What is the purpose of `IDisposable` and the `using` statement?",
      options: [
        "To mark objects for immediate garbage collection",
        "To release unmanaged resources deterministically when an object goes out of scope",
        "To prevent object creation on the heap",
        "To enable serialization",
      ],
      answer: 1,
      explanation:
        "IDisposable.Dispose() releases unmanaged resources (file handles, DB connections). The using statement guarantees Dispose() is called even if an exception occurs.",
    },
    {
      q: "What is dependency injection in ASP.NET Core?",
      options: [
        "Manually creating objects inside constructors",
        "A built-in IoC container that resolves constructor dependencies via registered services",
        "A NuGet package for testing",
        "Only applicable to database contexts",
      ],
      answer: 1,
      explanation:
        "ASP.NET Core has a built-in DI container. Services are registered in Program.cs (AddSingleton, AddScoped, AddTransient) and injected via constructor parameters.",
    },
    {
      q: "What is the difference between `IEnumerable` and `IQueryable` in C#?",
      options: [
        "IQueryable works in memory; IEnumerable translates to SQL",
        "IEnumerable executes in memory (LINQ to Objects); IQueryable builds an expression tree for remote execution (e.g. EF/SQL)",
        "They are interchangeable",
        "IQueryable is only for XML data sources",
      ],
      answer: 1,
      explanation:
        "IEnumerable processes data in-memory. IQueryable builds an expression tree that providers like Entity Framework translate to SQL, filtering on the database rather than in application memory.",
    },
    {
      q: "What is Entity Framework Core?",
      options: [
        "A web framework for building APIs",
        "An ORM that maps C# classes to database tables and generates SQL from LINQ queries",
        "A unit testing framework",
        "A caching library",
      ],
      answer: 1,
      explanation:
        "EF Core is Microsofts ORM (Object-Relational Mapper). It maps POCO classes to DB tables, tracks changes, and generates SQL. Supports Code-First and Database-First approaches.",
    },
    {
      q: "What is the difference between `Singleton`, `Scoped`, and `Transient` lifetimes in ASP.NET Core DI?",
      options: [
        "They all create one instance per application",
        "Singleton = one instance ever; Scoped = one per HTTP request; Transient = new instance every injection",
        "Transient = one per request; Scoped = one ever; Singleton = one per thread",
        "They only differ in thread safety, not instantiation count",
      ],
      answer: 1,
      explanation:
        "Singleton creates one instance for the application lifetime. Scoped creates one per request (ideal for DbContext). Transient creates a new instance every time it is requested.",
    },
  ],

  devops_cloud: [
    {
      q: "What is the difference between a Docker image and a Docker container?",
      options: [
        "They are the same thing",
        "An image is a read-only blueprint; a container is a running instance of an image",
        "A container is stored on disk; an image runs in memory",
        "Images are only used in production; containers in development",
      ],
      answer: 1,
      explanation:
        "A Docker image is an immutable, layered filesystem snapshot. A container is a running process isolated using that image as its root filesystem.",
    },
    {
      q: "What does Kubernetes do?",
      options: [
        "Builds Docker images automatically",
        "Orchestrates containers across a cluster: scheduling, scaling, healing, and service discovery",
        "Replaces Docker for container runtime",
        "Manages only stateless applications",
      ],
      answer: 1,
      explanation:
        "Kubernetes (K8s) orchestrates containerized workloads. It handles: scheduling pods to nodes, scaling replicas, health checks, rolling updates, and service discovery via DNS.",
    },
    {
      q: "What is the purpose of a CI/CD pipeline?",
      options: [
        "To replace manual testing entirely",
        "To automate building, testing, and deploying code changes consistently and reliably",
        "To manage database migrations only",
        "To containerize applications",
      ],
      answer: 1,
      explanation:
        "CI (Continuous Integration) automatically builds and tests every commit. CD (Continuous Delivery/Deployment) automatically deploys passing builds to staging or production.",
    },
    {
      q: "What is Infrastructure as Code (IaC)?",
      options: [
        "Writing code that runs on cloud infrastructure",
        "Managing infrastructure through machine-readable configuration files rather than manual processes",
        "A programming paradigm for distributed systems",
        "Monitoring infrastructure with code-based dashboards",
      ],
      answer: 1,
      explanation:
        "IaC (Terraform, Pulumi, CloudFormation) defines infrastructure declaratively in code. It enables version control, reproducibility, and automation of environment provisioning.",
    },
  ],

  mobile_advanced: [
    {
      q: "What is the difference between React Native and Flutter?",
      options: [
        "React Native uses JavaScript and native components; Flutter uses Dart and its own rendering engine",
        "They are the same framework with different names",
        "Flutter only works on iOS; React Native only on Android",
        "React Native requires a Mac; Flutter works cross-platform",
      ],
      answer: 0,
      explanation:
        "React Native renders native platform UI components via a JavaScript bridge. Flutter compiles Dart to native ARM and uses its own Skia/Impeller rendering engine, giving pixel-perfect cross-platform UI.",
    },
    {
      q: "What is the Android Activity lifecycle?",
      options: [
        "onCreate → onStart → onResume → onPause → onStop → onDestroy",
        "init → start → resume → pause → stop → kill",
        "onBuild → onRun → onPause → onClose",
        "onCreate is the only required callback",
      ],
      answer: 0,
      explanation:
        "Android Activities follow: onCreate (initial setup) → onStart (visible) → onResume (interactive) → onPause (partially hidden) → onStop (fully hidden) → onDestroy (finishing).",
    },
    {
      q: "What is Jetpack Compose in Android development?",
      options: [
        "A build tool replacing Gradle",
        "A modern declarative UI toolkit for Android using Kotlin, replacing XML layouts",
        "A database library",
        "An animation library only",
      ],
      answer: 1,
      explanation:
        "Jetpack Compose is Googles modern toolkit for building native Android UI declaratively in Kotlin, similar in concept to React or SwiftUI.",
    },
  ],

  // ── SQL / Database ───────────────────────────────────────────────────────────
  sql_advanced: [
    {
      q: "What is the difference between INNER JOIN and LEFT JOIN?",
      options: [
        "They are the same",
        "INNER JOIN returns only matching rows from both tables; LEFT JOIN returns all rows from the left table plus matches from the right",
        "LEFT JOIN returns only the left table; INNER JOIN returns both tables fully",
        "INNER JOIN is faster; LEFT JOIN is more accurate",
      ],
      answer: 1,
      explanation:
        "INNER JOIN returns rows where the join condition matches in BOTH tables. LEFT JOIN returns ALL rows from the left table; where no match exists in the right table, NULLs are returned.",
    },
    {
      q: "What does the HAVING clause do, and how is it different from WHERE?",
      options: [
        "HAVING filters individual rows; WHERE filters groups",
        "HAVING filters groups after GROUP BY; WHERE filters rows before grouping",
        "They are interchangeable",
        "HAVING only works with COUNT; WHERE works with all aggregates",
      ],
      answer: 1,
      explanation:
        "WHERE filters rows BEFORE aggregation. HAVING filters groups AFTER GROUP BY and aggregate functions have been applied. You cannot use aggregate functions in WHERE.",
    },
    {
      q: "What is a database index and what is its trade-off?",
      options: [
        "A copy of the whole table; trade-off is disk space",
        "A data structure (B-tree/hash) that speeds up reads; trade-off is slower writes and extra storage",
        "A constraint that ensures uniqueness; no trade-offs",
        "A backup mechanism; trade-off is replication lag",
      ],
      answer: 1,
      explanation:
        "An index is a separate data structure (usually B-tree) that allows the database to find rows without scanning the whole table. Trade-off: faster SELECT but slower INSERT/UPDATE/DELETE because the index must be maintained.",
    },
    {
      q: "What is the difference between DELETE, TRUNCATE, and DROP?",
      options: [
        "They all do the same thing",
        "DELETE removes specific rows (can WHERE, is logged); TRUNCATE removes all rows fast (no WHERE, minimal logging); DROP removes the entire table structure",
        "TRUNCATE is for columns; DELETE is for rows; DROP is for databases",
        "DELETE is permanent; TRUNCATE and DROP can be rolled back",
      ],
      answer: 1,
      explanation:
        "DELETE: removes rows one by one, can use WHERE, fully logged, slower. TRUNCATE: removes all rows at once, cannot WHERE, minimally logged, faster. DROP: removes the table structure and all data entirely.",
    },
    {
      q: "What is a PRIMARY KEY constraint?",
      options: [
        "The first column of any table",
        "A column or combination of columns that uniquely identifies each row and cannot be NULL",
        "A foreign key that references another table",
        "An auto-incrementing integer column",
      ],
      answer: 1,
      explanation:
        "A PRIMARY KEY uniquely identifies each row in a table. It enforces both UNIQUE and NOT NULL constraints. A table can have only one primary key but it can span multiple columns (composite key).",
    },
    {
      q: "What is a window function in SQL?",
      options: [
        "A function that creates a database view",
        "A function that performs calculations across rows related to the current row without collapsing them into groups",
        "A function that only works on the first and last rows of a result set",
        "A function for full-text search",
      ],
      answer: 1,
      explanation:
        "Window functions (ROW_NUMBER, RANK, LAG, LEAD, SUM OVER, etc.) compute values across a set of rows related to the current row. Unlike GROUP BY, they do not collapse rows — each row keeps its identity.",
    },
    {
      q: "What is database normalization?",
      options: [
        "Converting all text to lowercase",
        "Organizing data to reduce redundancy and improve integrity by splitting data into related tables",
        "Adding indexes to all columns",
        "Encrypting sensitive columns",
      ],
      answer: 1,
      explanation:
        "Normalization organizes a database to reduce data redundancy and improve data integrity. It involves decomposing tables into smaller, well-structured tables following normal forms (1NF, 2NF, 3NF, BCNF).",
    },
    {
      q: "What is the difference between a correlated and a non-correlated subquery?",
      options: [
        "They are the same — just different naming conventions",
        "A non-correlated subquery runs once independently; a correlated subquery references the outer query and runs once per outer row",
        "Correlated subqueries are faster; non-correlated are more readable",
        "Correlated subqueries can only use SELECT; non-correlated can use any DML",
      ],
      answer: 1,
      explanation:
        "Non-correlated: the inner query executes once and its result is used by the outer query. Correlated: the inner query references columns from the outer query and executes once for each row of the outer query — can be slow.",
    },
  ],

  // ── DevOps / Cloud ──────────────────────────────────────────────────────────
  devops_advanced: [
    {
      q: "What is the difference between a Docker image and a container?",
      options: [
        "They are the same thing",
        "An image is an immutable blueprint; a container is a running instance of that image",
        "A container is stored on disk; an image runs in memory",
        "Images are only used in production",
      ],
      answer: 1,
      explanation:
        "A Docker image is an immutable, layered filesystem snapshot. A container is a running process that uses that image as its root filesystem. You can run many containers from one image.",
    },
    {
      q: "What does Kubernetes do?",
      options: [
        "It builds Docker images",
        "It orchestrates containers across a cluster — scheduling, scaling, self-healing, and service discovery",
        "It replaces Docker entirely",
        "It manages only databases in production",
      ],
      answer: 1,
      explanation:
        "Kubernetes (K8s) automates deployment, scaling, and management of containerized applications. Key features: Pod scheduling, ReplicaSets for scaling, self-healing, Services for networking, ConfigMaps/Secrets for config.",
    },
    {
      q: "What is the purpose of a CI/CD pipeline?",
      options: [
        "To replace manual testing",
        "To automatically build, test, and deploy code on every commit — ensuring fast, reliable releases",
        "To manage database migrations only",
        "To monitor application performance",
      ],
      answer: 1,
      explanation:
        "CI (Continuous Integration) automatically builds and tests every commit. CD (Continuous Delivery/Deployment) automatically deploys passing builds. Together they reduce manual effort and catch bugs early.",
    },
    {
      q: "What is Infrastructure as Code (IaC)?",
      options: [
        "Writing application code that runs on cloud servers",
        "Managing and provisioning infrastructure through machine-readable configuration files (e.g. Terraform, CloudFormation)",
        "A monitoring solution for cloud infrastructure",
        "A programming paradigm for distributed systems",
      ],
      answer: 1,
      explanation:
        "IaC defines infrastructure (servers, networks, databases) in code files that can be version-controlled, reviewed, and automated. Tools: Terraform, Pulumi, AWS CloudFormation, Ansible.",
    },
    {
      q: "What is the difference between horizontal and vertical scaling?",
      options: [
        "Horizontal: bigger machine; Vertical: more machines",
        "Horizontal: add more machines (scale out); Vertical: upgrade existing machine resources (scale up)",
        "They are the same concept with different names",
        "Horizontal scaling is for databases only",
      ],
      answer: 1,
      explanation:
        "Vertical scaling (scale up): add CPU/RAM to existing server — has limits and requires downtime. Horizontal scaling (scale out): add more servers — better fault tolerance, preferred for cloud-native apps.",
    },
    {
      q: "What is a Kubernetes Pod?",
      options: [
        "A virtual machine running in Kubernetes",
        "The smallest deployable unit in Kubernetes — one or more containers that share network and storage",
        "A Kubernetes cluster node",
        "A type of Kubernetes service",
      ],
      answer: 1,
      explanation:
        "A Pod is the smallest unit in Kubernetes. It contains one or more containers that share the same IP address, port space, and storage volumes. Containers in a Pod communicate via localhost.",
    },
    {
      q: "What is the purpose of environment variables in deployment?",
      options: [
        "To store application logs",
        "To externalize configuration (API keys, database URLs, feature flags) so the same image runs in dev/staging/prod without code changes",
        "To define the programming language runtime",
        "To configure the operating system kernel",
      ],
      answer: 1,
      explanation:
        "Environment variables separate configuration from code. The same Docker image can connect to different databases or use different API keys depending on the environment by changing env vars — not rebuilding the image.",
    },
    {
      q: "What does a reverse proxy do?",
      options: [
        "It connects clients directly to backend servers",
        "It sits in front of backend servers, forwards client requests, handles SSL termination, load balancing, and caching",
        "It prevents backend servers from making outbound requests",
        "It encrypts database connections only",
      ],
      answer: 1,
      explanation:
        "A reverse proxy (Nginx, Caddy, AWS ALB) sits between clients and backend servers. It handles SSL termination, load balancing, caching, compression, and hides backend server details from clients.",
    },
  ],

  // ── Python (extended) ───────────────────────────────────────────────────────
  python_extended: [
    {
      q: "What is the difference between a list and a tuple in Python?",
      options: [
        "Lists are faster; tuples use less memory",
        "Lists are mutable (can change); tuples are immutable (cannot change after creation)",
        "Tuples can hold mixed types; lists cannot",
        "Lists are ordered; tuples are unordered",
      ],
      answer: 1,
      explanation:
        "Lists [] are mutable — you can append, remove, or change elements. Tuples () are immutable — once created, elements cannot be changed. Tuples are slightly faster and used for fixed data.",
    },
    {
      q: "What are Python decorators?",
      options: [
        "Comments that describe functions",
        "Functions that wrap another function to extend its behaviour without modifying it",
        "A type of class inheritance",
        "Python's version of interfaces",
      ],
      answer: 1,
      explanation:
        "A decorator is a function that takes another function as an argument, adds some behaviour, and returns a new function. Used with @syntax. Common examples: @staticmethod, @property, @app.route in Flask.",
    },
    {
      q: "What is the GIL (Global Interpreter Lock) in Python?",
      options: [
        "A security mechanism that locks Python files",
        "A mutex that allows only one thread to execute Python bytecode at a time — limits true parallelism in CPU-bound threads",
        "A garbage collection algorithm",
        "A package manager lock file",
      ],
      answer: 1,
      explanation:
        "The GIL is a lock in CPython that ensures only one thread runs Python code at a time. It prevents CPU-bound multithreading from using multiple cores. For CPU parallelism, use multiprocessing instead.",
    },
    {
      q: "What is the difference between `__str__` and `__repr__` in Python?",
      options: [
        "They are identical",
        "__str__ is a human-readable string for end users; __repr__ is an unambiguous representation for developers/debugging",
        "__repr__ is for printing; __str__ is for logging",
        "__str__ works on all objects; __repr__ only works on custom classes",
      ],
      answer: 1,
      explanation:
        "__str__ is called by print() and str() — meant to be readable. __repr__ is called by repr() and in the REPL — should ideally return a string that could recreate the object. If __str__ is not defined, __repr__ is used.",
    },
  ],

  // ── General CS fundamentals (replaces logical_reasoning) ───────────────────
  cs_fundamentals: [
    {
      q: "What is the difference between TCP and UDP?",
      options: [
        "TCP is faster; UDP is more reliable",
        "TCP is connection-oriented with guaranteed delivery and ordering; UDP is connectionless and faster but with no delivery guarantee",
        "They are the same protocol with different names",
        "UDP is used for web; TCP is used for email only",
      ],
      answer: 1,
      explanation:
        "TCP provides reliable, ordered, error-checked delivery via a connection handshake. UDP is lightweight, connectionless, and faster — used for video streaming, DNS, and gaming where some packet loss is acceptable.",
    },
    {
      q: "What is the difference between authentication and authorization?",
      options: [
        "They are the same thing",
        "Authentication verifies who you are (identity); authorization determines what you are allowed to do (permissions)",
        "Authorization happens before authentication",
        "Authentication is for APIs; authorization is for web apps only",
      ],
      answer: 1,
      explanation:
        'Authentication: "Who are you?" — verifying identity via passwords, tokens, biometrics. Authorization: "What can you do?" — checking permissions after identity is confirmed. Auth (authn) before authz.',
    },
    {
      q: "What is a deadlock in concurrent systems?",
      options: [
        "When a program runs too slowly",
        "When two or more processes are each waiting for the other to release a resource, causing all to be stuck indefinitely",
        "When a database query takes too long",
        "When a server runs out of memory",
      ],
      answer: 1,
      explanation:
        "Deadlock occurs when process A holds resource 1 and waits for resource 2, while process B holds resource 2 and waits for resource 1. Neither can proceed. Prevention strategies: resource ordering, timeouts, deadlock detection.",
    },
    {
      q: "What is the difference between SQL and NoSQL databases?",
      options: [
        "SQL is older; NoSQL is newer — otherwise they are equivalent",
        "SQL uses structured tables with fixed schemas and ACID transactions; NoSQL uses flexible schemas (documents, key-value, graphs) optimized for scale and flexibility",
        "NoSQL is only for large companies; SQL is for small projects",
        "SQL databases cannot scale; NoSQL databases cannot do joins",
      ],
      answer: 1,
      explanation:
        "SQL: relational, fixed schema, ACID transactions, great for complex queries (PostgreSQL, MySQL). NoSQL: flexible schema, designed for horizontal scale (MongoDB, Redis, Cassandra). Choice depends on data structure and consistency needs.",
    },
    {
      q: "What is caching and what problem does it solve?",
      options: [
        "Caching permanently stores data to replace databases",
        "Caching stores frequently accessed data in fast memory (RAM) to reduce latency and backend load",
        "Caching compresses data to save disk space",
        "Caching is only used for static files like images",
      ],
      answer: 1,
      explanation:
        "Caching stores the result of expensive operations (DB queries, API calls, computations) in fast storage (Redis, Memcached, browser cache). Reduces response time and backend load. Key challenge: cache invalidation — knowing when to update stale data.",
    },
    {
      q: "What is an API and what does REST mean?",
      options: [
        "API is a programming language; REST is a database",
        "API (Application Programming Interface) defines how software communicates; REST (Representational State Transfer) is an architectural style for APIs using HTTP methods and stateless requests",
        "REST is a type of API that only works with JSON",
        "APIs are only for mobile apps; REST is only for web browsers",
      ],
      answer: 1,
      explanation:
        "An API is a contract defining how systems communicate. REST is an architectural style: stateless, uses HTTP verbs (GET/POST/PUT/DELETE), resources identified by URLs, typically returns JSON. Not a protocol — a set of constraints.",
    },
  ],

  data_ml: [
    {
      q: "What is the difference between supervised and unsupervised learning?",
      options: [
        "Supervised learning uses more data",
        "Supervised learning trains on labelled examples; unsupervised learning finds patterns in unlabelled data",
        "Unsupervised learning requires human feedback during training",
        "Supervised learning uses neural networks; unsupervised uses decision trees",
      ],
      answer: 1,
      explanation:
        "Supervised: model learns from (input, label) pairs (classification, regression). Unsupervised: model finds structure in unlabelled data (clustering, dimensionality reduction).",
    },
    {
      q: "What is overfitting and how do you prevent it?",
      options: [
        "When a model is too simple to capture patterns; fixed by adding more features",
        "When a model learns training data too well including noise, failing to generalise; prevented by regularisation, dropout, more data, cross-validation",
        "When training takes too long; prevented by early stopping only",
        "When the model has too many parameters regardless of data size",
      ],
      answer: 1,
      explanation:
        "Overfitting: high training accuracy, low test accuracy. Solutions: L1/L2 regularisation, dropout, data augmentation, cross-validation, simpler model architecture.",
    },
    {
      q: "What does a confusion matrix show?",
      options: [
        "The learning rate schedule of a neural network",
        "A table showing True Positives, False Positives, True Negatives, and False Negatives for a classifier",
        "The correlation between all input features",
        "The distribution of predictions vs actual values for regression",
      ],
      answer: 1,
      explanation:
        "A confusion matrix shows TP (correctly predicted positive), TN (correctly predicted negative), FP (predicted positive but actually negative), FN (predicted negative but actually positive). Used to compute precision, recall, F1.",
    },
  ],
};

/**
 * Pick quiz questions strictly matched to the candidate's role and skills.
 * No puzzles, riddles, or logical reasoning — only technical questions
 * directly relevant to the job role.
 */
export function pickQuizQuestions(
  skills = [],
  count = 10,
  jobRole = "",
  candidateName = "",
) {
  const sl = skills.map((s) => s.toLowerCase());
  const role = (jobRole || "").toLowerCase();
  const all = [];
  const seen = new Set();

  const add = (pool, topic) => {
    for (const q of pool || []) {
      if (!seen.has(q.q)) {
        all.push({ ...q, topic });
        seen.add(q.q);
      }
    }
  };

  // ── Role detection ──────────────────────────────────────────────
  const is = (...words) => words.some((w) => role.includes(w));
  const has = (...words) => words.some((w) => sl.some((s) => s.includes(w)));

  const isFrontend = is(
    "frontend",
    "front-end",
    "ui developer",
    "react developer",
    "vue",
    "angular",
    "web developer",
  );
  const isBackend = is(
    "backend",
    "back-end",
    "api developer",
    "server",
    "microservice",
    "node developer",
  );
  const isFullStack = is("full stack", "fullstack", "full-stack");
  const isJava =
    (is("java") && !is("javascript")) || has("spring", "maven", "hibernate");
  const isDotNet =
    is(".net", "dotnet", "c# developer", "asp.net", "blazor") ||
    has("c#", ".net", "entity framework", "blazor");
  const isPython =
    is("python", "django", "flask", "fastapi") ||
    has("python", "django", "flask", "fastapi");
  const isML =
    is(
      "machine learning",
      "ml engineer",
      "data scientist",
      "ai engineer",
      "deep learning",
    ) || has("tensorflow", "pytorch", "scikit", "keras");
  const isData =
    is("data engineer", "data analyst", "analytics engineer", "etl") ||
    has("spark", "airflow", "dbt", "bigquery", "redshift", "snowflake");
  const isSQL =
    is(
      "sql developer",
      "database developer",
      "dba",
      "database administrator",
    ) || has("postgresql", "mysql", "oracle", "sql server", "sqlite");
  const isDevOps =
    is(
      "devops",
      "cloud engineer",
      "sre",
      "platform engineer",
      "infrastructure",
    ) ||
    has(
      "docker",
      "kubernetes",
      "terraform",
      "ansible",
      "jenkins",
      "aws",
      "azure",
      "gcp",
    );
  const isMobile =
    is("mobile", "android", "ios", "flutter", "react native") ||
    has("android", "ios", "flutter", "swift", "kotlin", "react native");
  const isGeneral =
    is("software engineer", "software developer", "engineer", "developer") &&
    !isFrontend &&
    !isBackend &&
    !isJava &&
    !isDotNet &&
    !isPython &&
    !isML &&
    !isData &&
    !isSQL &&
    !isDevOps &&
    !isMobile &&
    !isFullStack;

  // ── Load role-specific banks FIRST (most relevant) ──────────────

  if (isJava) {
    add(EXTENDED_QUIZ.java_advanced, "java");
    add(EXTENDED_QUIZ.backend_advanced, "backend");
  }
  if (isDotNet) {
    add(EXTENDED_QUIZ.dotnet_advanced, ".net/c#");
    add(EXTENDED_QUIZ.backend_advanced, "backend");
  }
  if (isPython) {
    add(EXTENDED_QUIZ.python_advanced, "python");
    add(EXTENDED_QUIZ.python_extended, "python");
    add(EXTENDED_QUIZ.backend_advanced, "backend");
  }
  if (isML) {
    add(EXTENDED_QUIZ.data_ml, "data/ml");
    add(EXTENDED_QUIZ.python_advanced, "python");
    add(EXTENDED_QUIZ.python_extended, "python");
  }
  if (isData) {
    add(EXTENDED_QUIZ.data_ml, "data/ml");
    add(EXTENDED_QUIZ.sql_advanced, "sql");
    add(EXTENDED_QUIZ.backend_advanced, "backend");
  }
  if (isSQL) {
    add(EXTENDED_QUIZ.sql_advanced, "sql");
    add(EXTENDED_QUIZ.backend_advanced, "backend");
  }
  if (isDevOps) {
    add(EXTENDED_QUIZ.devops_advanced, "devops");
    add(EXTENDED_QUIZ.devops_cloud, "devops");
    add(EXTENDED_QUIZ.system_design, "system design");
  }
  if (isMobile) {
    add(EXTENDED_QUIZ.mobile_advanced, "mobile");
    add(EXTENDED_QUIZ.system_design, "system design");
  }
  if (isFrontend) {
    add(EXTENDED_QUIZ.frontend_advanced, "frontend");
    add(EXTENDED_QUIZ.system_design, "system design");
  }
  if (isBackend) {
    add(EXTENDED_QUIZ.backend_advanced, "backend");
    add(EXTENDED_QUIZ.system_design, "system design");
  }
  if (isFullStack) {
    add(EXTENDED_QUIZ.backend_advanced, "backend");
    add(EXTENDED_QUIZ.frontend_advanced, "frontend");
    add(EXTENDED_QUIZ.system_design, "system design");
  }

  // Always add system design for any engineering role
  add(EXTENDED_QUIZ.system_design, "system design");

  // ── Add language-specific base questions only if relevant ────────
  const wantJS =
    isFrontend ||
    isFullStack ||
    isBackend ||
    has("javascript", "typescript", "node.js", "nestjs");
  const wantReact = isFrontend || isFullStack || has("react", "next.js");
  const wantSQL =
    isSQL ||
    isData ||
    isBackend ||
    isFullStack ||
    isJava ||
    isDotNet ||
    has("sql", "postgresql", "mysql", "oracle");
  const wantPy = isPython || isML || isData || has("python");

  if (wantReact) add(QUIZ_QUESTIONS.react, "react");
  if (wantJS) add(QUIZ_QUESTIONS.javascript, "javascript");
  if (wantPy) add(QUIZ_QUESTIONS.python, "python");
  if (wantSQL) add(EXTENDED_QUIZ.sql_advanced, "sql");

  // ── CS fundamentals — relevant to ALL roles ──────────────────────
  add(EXTENDED_QUIZ.cs_fundamentals, "fundamentals");
  add(QUIZ_QUESTIONS.general, "general");

  // Fallback: if still not enough questions, add everything
  if (all.length < count) {
    add(EXTENDED_QUIZ.backend_advanced, "backend");
    add(EXTENDED_QUIZ.frontend_advanced, "frontend");
    add(EXTENDED_QUIZ.system_design, "system design");
  }

  // ── Seeded shuffle — same candidate always gets same set ─────────
  const seed = (candidateName + new Date().toDateString())
    .split("")
    .reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = (i) => {
    const x = Math.sin(seed + i) * 10000;
    return x - Math.floor(x);
  };

  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rand(i) * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }

  return all.slice(0, count);
}
