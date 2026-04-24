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

  logical_reasoning: [
    {
      q: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?",
      options: ["$0.10", "$0.05", "$0.15", "$0.20"],
      answer: 1,
      explanation:
        "The ball costs $0.05. If ball = x, then bat = x + $1.00. Together: x + (x + 1.00) = 1.10 → 2x = 0.10 → x = $0.05. The intuitive answer ($0.10) is wrong — that would make the total $1.20.",
    },
    {
      q: "If you have a 3-litre jug and a 5-litre jug, how do you measure exactly 4 litres of water?",
      options: [
        "Fill the 5L, pour into 3L, empty 3L, pour remaining into 3L, fill 5L again, top up 3L — leaves 4L in 5L",
        "Fill both jugs and combine them",
        "Fill the 3L twice and pour into 5L",
        "You cannot measure exactly 4 litres with these jugs",
      ],
      answer: 0,
      explanation:
        "Fill 5L → pour into 3L (5L has 2L left) → empty 3L → pour 2L into 3L → fill 5L again → pour from 5L into 3L (needs 1L) → 5L now has 4L.",
    },
    {
      q: "In a race, you overtake the person in 2nd place. What position are you now in?",
      options: [
        "1st place",
        "2nd place",
        "3rd place",
        "It depends on the total number of runners",
      ],
      answer: 1,
      explanation:
        "You overtook 2nd place, so you are now in 2nd place — not 1st. To be in 1st you would need to overtake the person in 1st place.",
    },
    {
      q: "A sorted array is rotated at some pivot. Which algorithm finds a target value in O(log n) time?",
      options: [
        "Linear search from both ends",
        "Modified binary search checking which half is sorted",
        "Sort it first then binary search — O(n log n)",
        "Hash the array elements then lookup",
      ],
      answer: 1,
      explanation:
        "Modified binary search: at each step, one half is always sorted. Check if the target lies in the sorted half; if yes search there, else search the other half. This gives O(log n) without re-sorting.",
    },
    {
      q: "You have 8 identical-looking balls. One is slightly heavier. Using a balance scale, what is the minimum number of weighings needed to guarantee finding the heavy ball?",
      options: ["3 weighings", "2 weighings", "4 weighings", "1 weighing"],
      answer: 1,
      explanation:
        "2 weighings: Split into 3-3-2. Weigh 3 vs 3. If balanced, heavy ball is in the 2 — one more weighing finds it. If unbalanced, take the heavier group of 3, weigh 1 vs 1 — if balanced the third is heavy, else the heavier one is it.",
    },
    {
      q: "A function f(n) calls itself with f(n/2) and does O(1) work per call. What is the time complexity?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      answer: 1,
      explanation:
        "Each call halves n, so the depth of recursion is log₂(n). With O(1) work per level, total complexity is O(log n). This is the pattern of binary search.",
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
 * Pick quiz questions matched to the candidate's role and skills.
 * Uses seeded shuffle so the same candidate always gets the same set
 * but different candidates get different subsets.
 */
export function pickQuizQuestions(
  skills = [],
  count = 10,
  jobRole = "",
  candidateName = "",
) {
  const skillsLower = skills.map((s) => s.toLowerCase());
  const role = (jobRole || "").toLowerCase();
  const allQuestions = [];
  const used = new Set();

  const addFrom = (pool, topic) => {
    for (const q of pool) {
      if (!used.has(q.q)) {
        allQuestions.push({ ...q, topic });
        used.add(q.q);
      }
    }
  };

  // ── Detect role category ────────────────────────────────────────
  const isFrontend =
    role.includes("frontend") ||
    role.includes("front-end") ||
    role.includes("ui") ||
    role.includes("react") ||
    role.includes("vue") ||
    role.includes("angular");
  const isBackend =
    role.includes("backend") ||
    role.includes("back-end") ||
    role.includes("api") ||
    role.includes("server") ||
    role.includes("microservice");
  const isJava = role.includes("java") && !role.includes("javascript");
  const isDotNet =
    role.includes(".net") ||
    role.includes("dotnet") ||
    role.includes("c#") ||
    role.includes("csharp") ||
    role.includes("asp.net") ||
    role.includes("blazor");
  const isPython =
    role.includes("python") ||
    role.includes("django") ||
    role.includes("flask") ||
    role.includes("fastapi");
  const isML =
    role.includes("ml") ||
    role.includes("machine learning") ||
    role.includes("data scientist") ||
    role.includes("ai engineer") ||
    role.includes("deep learning");
  const isData =
    role.includes("data engineer") ||
    role.includes("data analyst") ||
    role.includes("analytics");
  const isDevOps =
    role.includes("devops") ||
    role.includes("cloud") ||
    role.includes("sre") ||
    role.includes("infrastructure") ||
    role.includes("platform engineer");
  const isMobile =
    role.includes("mobile") ||
    role.includes("android") ||
    role.includes("ios") ||
    role.includes("flutter") ||
    role.includes("react native") ||
    role.includes("kotlin") ||
    role.includes("swift");
  const isFullStack =
    role.includes("full") ||
    role.includes("fullstack") ||
    role.includes("full-stack");
  const isSoftware =
    role.includes("software") ||
    role.includes("engineer") ||
    role.includes("developer");

  // Also detect from skills
  const hasJava = skillsLower.some(
    (s) =>
      s === "java" ||
      s.includes("spring") ||
      s.includes("maven") ||
      s.includes("gradle"),
  );
  const hasDotNet = skillsLower.some(
    (s) =>
      s.includes("c#") ||
      s.includes(".net") ||
      s.includes("asp.net") ||
      s.includes("entity framework") ||
      s.includes("blazor"),
  );
  const hasPython = skillsLower.some(
    (s) => s.includes("python") || s.includes("django") || s.includes("flask"),
  );
  const hasReactSkill = skillsLower.some((s) =>
    ["react", "next.js", "vue", "angular", "svelte"].includes(s),
  );
  const hasJS = skillsLower.some((s) =>
    ["javascript", "typescript", "node.js", "express", "nestjs"].includes(s),
  );
  const hasSQL = skillsLower.some(
    (s) =>
      s.includes("sql") ||
      s.includes("postgres") ||
      s.includes("mysql") ||
      s.includes("oracle"),
  );
  const hasDevOps = skillsLower.some((s) =>
    [
      "docker",
      "kubernetes",
      "aws",
      "azure",
      "gcp",
      "terraform",
      "ansible",
      "jenkins",
      "github actions",
      "ci/cd",
    ].includes(s),
  );
  const hasMobile = skillsLower.some((s) =>
    [
      "android",
      "ios",
      "flutter",
      "react native",
      "kotlin",
      "swift",
      "jetpack",
      "swiftui",
    ].includes(s),
  );

  // ── Load role-specific questions FIRST (highest priority) ──────
  if (isJava || hasJava) {
    addFrom(EXTENDED_QUIZ.java_advanced, "java");
    addFrom(EXTENDED_QUIZ.backend_advanced, "backend");
    addFrom(EXTENDED_QUIZ.system_design, "system design");
  }
  if (isDotNet || hasDotNet) {
    addFrom(EXTENDED_QUIZ.dotnet_advanced, ".net/c#");
    addFrom(EXTENDED_QUIZ.backend_advanced, "backend");
    addFrom(EXTENDED_QUIZ.system_design, "system design");
  }
  if (isPython || hasPython) {
    addFrom(EXTENDED_QUIZ.python_advanced, "python");
    addFrom(EXTENDED_QUIZ.backend_advanced, "backend");
  }
  if (isML) {
    addFrom(EXTENDED_QUIZ.data_ml, "data/ml");
    addFrom(EXTENDED_QUIZ.python_advanced, "python");
  }
  if (isData) {
    addFrom(EXTENDED_QUIZ.data_ml, "data/ml");
    addFrom(EXTENDED_QUIZ.backend_advanced, "backend");
  }
  if (isDevOps || hasDevOps) {
    addFrom(EXTENDED_QUIZ.devops_cloud, "devops/cloud");
    addFrom(EXTENDED_QUIZ.backend_advanced, "backend");
    addFrom(EXTENDED_QUIZ.system_design, "system design");
  }
  if (isMobile || hasMobile) {
    addFrom(EXTENDED_QUIZ.mobile_advanced, "mobile");
    addFrom(EXTENDED_QUIZ.system_design, "system design");
  }
  if (isFrontend && !isJava && !isDotNet) {
    addFrom(EXTENDED_QUIZ.frontend_advanced, "frontend");
    addFrom(EXTENDED_QUIZ.system_design, "system design");
  }
  if (isBackend && !isJava && !isDotNet && !isPython) {
    addFrom(EXTENDED_QUIZ.backend_advanced, "backend");
    addFrom(EXTENDED_QUIZ.system_design, "system design");
  }
  if (isFullStack) {
    addFrom(EXTENDED_QUIZ.backend_advanced, "backend");
    addFrom(EXTENDED_QUIZ.system_design, "system design");
    if (!isJava && !isDotNet)
      addFrom(EXTENDED_QUIZ.frontend_advanced, "frontend");
  }
  // Always add system design for any engineering role
  if (
    isSoftware &&
    !isJava &&
    !isDotNet &&
    !isPython &&
    !isML &&
    !isDevOps &&
    !isMobile &&
    !isFrontend &&
    !isBackend &&
    !isFullStack
  ) {
    addFrom(EXTENDED_QUIZ.backend_advanced, "backend");
    addFrom(EXTENDED_QUIZ.system_design, "system design");
  }

  // ── Fallback: add system design for everyone ────────────────────
  addFrom(EXTENDED_QUIZ.system_design, "system design");

  // ── Skill-matched base bank questions (language-specific) ────────
  // Only add JS/React questions if the role/skills actually involve them
  const addJS =
    !isJava &&
    !isDotNet &&
    (hasJS ||
      hasReactSkill ||
      isFrontend ||
      isFullStack ||
      (!isJava && !isDotNet && !isPython && !isML && !isDevOps && !isMobile));
  const addReact = !isJava && !isDotNet && (hasReactSkill || isFrontend);
  const addPyBase = hasPython || isPython || isML || isData;
  const addSQLBase = hasSQL || isData || isBackend || isJava || isDotNet;

  if (addReact) {
    for (const q of QUIZ_QUESTIONS.react || []) {
      if (!used.has(q.q)) {
        allQuestions.push({ ...q, topic: "react" });
        used.add(q.q);
      }
    }
  }
  if (addJS) {
    for (const q of QUIZ_QUESTIONS.javascript || []) {
      if (!used.has(q.q)) {
        allQuestions.push({ ...q, topic: "javascript" });
        used.add(q.q);
      }
    }
  }
  if (addPyBase) {
    for (const q of QUIZ_QUESTIONS.python || []) {
      if (!used.has(q.q)) {
        allQuestions.push({ ...q, topic: "python" });
        used.add(q.q);
      }
    }
  }
  if (addSQLBase) {
    for (const q of QUIZ_QUESTIONS.sql || []) {
      if (!used.has(q.q)) {
        allQuestions.push({ ...q, topic: "sql" });
        used.add(q.q);
      }
    }
  }

  // ── Always add logical reasoning (2-3 questions for everyone) ────
  for (const q of QUIZ_QUESTIONS.logical_reasoning || []) {
    if (!used.has(q.q)) {
      allQuestions.push({ ...q, topic: "logical_reasoning" });
      used.add(q.q);
    }
  }
  for (const q of QUIZ_QUESTIONS.general || []) {
    if (!used.has(q.q)) {
      allQuestions.push({ ...q, topic: "general" });
      used.add(q.q);
    }
  }

  // ── Seeded shuffle ────────────────────────────────────────────────
  const seed = (candidateName + new Date().toDateString())
    .split("")
    .reduce((a, c) => a + c.charCodeAt(0), 0);
  const seededRandom = (i) => {
    const x = Math.sin(seed + i) * 10000;
    return x - Math.floor(x);
  };

  for (let i = allQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(i) * (i + 1));
    [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
  }

  // ── Guarantee at least 2 logic questions in final set ─────────────
  const logicQs = allQuestions.filter((q) => q.topic === "logical_reasoning");
  const others = allQuestions.filter((q) => q.topic !== "logical_reasoning");
  const combined = [...logicQs.slice(0, 2), ...others].slice(0, count);

  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(i + 100) * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return combined.slice(0, count);
}
