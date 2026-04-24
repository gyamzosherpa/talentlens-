/**
 * DSA Challenge Bank — 30+ problems across difficulty levels and topics.
 * Mapped to roles so candidates get role-relevant challenges.
 */

export const DSA_CHALLENGES = [
  // ── Arrays & Hashing ──────────────────────────────────────────────────────
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays / Hash Map",
    roles: ["all"],
    question: `Given an array of integers \`nums\` and a target integer, return the indices of the two numbers that add up to target. Exactly one solution exists.
  Output: [1, 2]`,
    boilerplates: {
      javascript: `function twoSum(nums, target) {\n  // your solution\n}\n\nconsole.log(twoSum([2,7,11,15], 9)); // [0,1]\nconsole.log(twoSum([3,2,4], 6));     // [1,2]`,
      python: `def two_sum(nums, target):\n    # your solution\n    pass\n\nprint(two_sum([2,7,11,15], 9)) # [0,1]\nprint(two_sum([3,2,4], 6))     # [1,2]`,
      java: `import java.util.*;\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // your solution\n        return new int[]{};\n    }\n}`,
    },
    hints: [
      "Consider using a hash map to store seen values.",
      "For each number, check if (target - number) is already in the map.",
    ],
    optimalComplexity: "O(n) time, O(n) space",
  },

  {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    topic: "Arrays / Hash Set",
    roles: ["all"],
    question: `Given an integer array \`nums\`, return true if any value appears more than once, false otherwise.`,
    boilerplates: {
      javascript: `function containsDuplicate(nums) {\n  // your solution\n}\n\nconsole.log(containsDuplicate([1,2,3,1]));   // true\nconsole.log(containsDuplicate([1,2,3,4]));   // false`,
      python: `def contains_duplicate(nums):\n    # your solution\n    pass\n\nprint(contains_duplicate([1,2,3,1]))   # True\nprint(contains_duplicate([1,2,3,4]))   # False`,
      java: `class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // your solution\n        return false;\n    }\n}`,
    },
    hints: ["A hash set can tell you if you've seen a number before in O(1)."],
    optimalComplexity: "O(n) time, O(n) space",
  },

  {
    id: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "Medium",
    topic: "Arrays / Hash Map",
    roles: ["backend", "fullstack", "software"],
    question: `Given an array of strings, group all anagrams together. Order doesn't matter.`,
    boilerplates: {
      javascript: `function groupAnagrams(strs) {\n  // your solution\n}\n\nconsole.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]));`,
      python: `def group_anagrams(strs):\n    # your solution\n    pass\n\nprint(group_anagrams(["eat","tea","tan","ate","nat","bat"]))`,
      java: `import java.util.*;\nclass Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        // your solution\n        return new ArrayList<>();\n    }\n}`,
    },
    hints: [
      "Sorting each string gives a canonical key for all its anagrams.",
      "Use a hash map: sorted string → list of originals.",
    ],
    optimalComplexity: "O(n·k log k) time where k = max string length",
  },

  // ── Strings ───────────────────────────────────────────────────────────────
  {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    topic: "Strings / Two Pointers",
    roles: ["frontend", "fullstack", "all"],
    question: `A string is a palindrome if it reads the same forward and backward, considering only alphanumeric characters and ignoring case.`,
    boilerplates: {
      javascript: `function isPalindrome(s) {\n  // your solution\n}\n\nconsole.log(isPalindrome("A man, a plan, a canal: Panama")); // true\nconsole.log(isPalindrome("race a car"));                     // false`,
      python: `def is_palindrome(s):\n    # your solution\n    pass\n\nprint(is_palindrome("A man, a plan, a canal: Panama")) # True\nprint(is_palindrome("race a car"))                     # False`,
      java: `class Solution {\n    public boolean isPalindrome(String s) {\n        // your solution\n        return false;\n    }\n}`,
    },
    hints: ["Use two pointers from both ends, skip non-alphanumeric chars."],
    optimalComplexity: "O(n) time, O(1) space",
  },

  {
    id: "longest-substring",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "Strings / Sliding Window",
    roles: ["frontend", "fullstack", "software", "backend"],
    question: `Given a string s, find the length of the longest substring without duplicate characters.`,
    boilerplates: {
      javascript: `function lengthOfLongestSubstring(s) {\n  // your solution\n}\n\nconsole.log(lengthOfLongestSubstring("abcabcbb")); // 3\nconsole.log(lengthOfLongestSubstring("pwwkew"));   // 3`,
      python: `def length_of_longest_substring(s):\n    # your solution\n    pass\n\nprint(length_of_longest_substring("abcabcbb")) # 3\nprint(length_of_longest_substring("pwwkew"))   # 3`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // your solution\n        return 0;\n    }\n}`,
    },
    hints: [
      "Sliding window with a hash set.",
      "When you see a duplicate, shrink the window from the left.",
    ],
    optimalComplexity: "O(n) time, O(min(n,m)) space",
  },

  // ── Stacks ────────────────────────────────────────────────────────────────
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stack",
    roles: ["all"],
    question: `Given a string with only '(', ')', '{', '}', '[', ']', determine if it is valid.

Rules:
1. Open brackets must be closed by the same type.
2. Open brackets must be closed in the correct order.`,
    boilerplates: {
      javascript: `function isValid(s) {\n  // your solution\n}\n\nconsole.log(isValid("()[]{}"));  // true\nconsole.log(isValid("(]"));      // false\nconsole.log(isValid("{[]}"));    // true`,
      python: `def is_valid(s):\n    # your solution\n    pass\n\nprint(is_valid("()[]{}"))  # True\nprint(is_valid("(]"))      # False`,
      java: `import java.util.*;\nclass Solution {\n    public boolean isValid(String s) {\n        // your solution\n        return false;\n    }\n}`,
    },
    hints: ["Use a stack — push on open, pop and compare on close."],
    optimalComplexity: "O(n) time, O(n) space",
  },

  // ── Linked Lists ──────────────────────────────────────────────────────────
  {
    id: "reverse-linked-list",
    title: "Reverse a Linked List",
    difficulty: "Easy",
    topic: "Linked List",
    roles: ["software", "backend", "fullstack"],
    question: `Reverse a singly linked list and return the new head.`,
    boilerplates: {
      javascript: `class ListNode {\n  constructor(val, next=null){this.val=val;this.next=next;}\n}\n\nfunction reverseList(head) {\n  // your solution\n}\n\n// Helper\nfunction build(a){if(!a.length)return null;const h=new ListNode(a[0]);let c=h;for(let i=1;i<a.length;i++){c.next=new ListNode(a[i]);c=c.next;}return h;}\nfunction print(h){const r=[];while(h){r.push(h.val);h=h.next;}console.log(r.join('→'));}\nprint(reverseList(build([1,2,3,4,5]))); // 5→4→3→2→1`,
      python: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val=val; self.next=next\n\ndef reverse_list(head):\n    # your solution\n    pass`,
      java: `class ListNode { int val; ListNode next; ListNode(int v){val=v;} }\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        // your solution\n        return null;\n    }\n}`,
    },
    hints: [
      "Keep prev, curr, next pointers.",
      "Reassign curr.next = prev, then advance both.",
    ],
    optimalComplexity: "O(n) time, O(1) space (iterative)",
  },

  {
    id: "detect-cycle",
    title: "Linked List Cycle Detection",
    difficulty: "Easy",
    topic: "Linked List / Two Pointers",
    roles: ["software", "backend"],
    question: `Given the head of a linked list, determine if it has a cycle. Return true or false.

A cycle means some node's next pointer points back to a previous node, creating a loop.

Follow-up: Can you solve it in O(1) space (no hash set)?`,
    boilerplates: {
      javascript: `function hasCycle(head) {\n  // your solution — can you do O(1) space?\n}\n`,
      python: `def has_cycle(head):\n    # your solution — can you do O(1) space?\n    pass\n`,
      java: `class Solution {\n    public boolean hasCycle(ListNode head) {\n        // your solution\n        return false;\n    }\n}`,
    },
    hints: [
      "Floyd's algorithm: fast pointer moves 2 steps, slow moves 1.",
      "If they meet, there's a cycle.",
    ],
    optimalComplexity: "O(n) time, O(1) space",
  },

  // ── Binary Search ─────────────────────────────────────────────────────────
  {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    topic: "Binary Search",
    roles: ["all"],
    question: `Given a sorted array of distinct integers and a target, return its index or -1 if not found. Must run in O(log n).`,
    boilerplates: {
      javascript: `function search(nums, target) {\n  // must be O(log n)\n}\n\nconsole.log(search([-1,0,3,5,9,12], 9));  // 4\nconsole.log(search([-1,0,3,5,9,12], 2));  // -1`,
      python: `def search(nums, target):\n    # must be O(log n)\n    pass\n\nprint(search([-1,0,3,5,9,12], 9))  # 4\nprint(search([-1,0,3,5,9,12], 2))  # -1`,
      java: `class Solution {\n    public int search(int[] nums, int target) {\n        // must be O(log n)\n        return -1;\n    }\n}`,
    },
    hints: [
      "left and right pointers.",
      "Check mid, eliminate the half that can't contain target.",
    ],
    optimalComplexity: "O(log n) time, O(1) space",
  },

  // ── Trees ─────────────────────────────────────────────────────────────────
  {
    id: "max-depth-tree",
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    topic: "Trees / DFS",
    roles: ["software", "backend", "fullstack", "ml"],
    question: `Given the root of a binary tree, return its maximum depth (number of nodes along the longest root-to-leaf path).`,
    boilerplates: {
      javascript: `function maxDepth(root) {\n  // your solution\n}\n`,
      python: `def max_depth(root):\n    # your solution\n    pass\n`,
      java: `class TreeNode { int val; TreeNode left, right; TreeNode(int v){val=v;} }\nclass Solution {\n    public int maxDepth(TreeNode root) {\n        // your solution\n        return 0;\n    }\n}`,
    },
    hints: [
      "DFS: depth = 1 + max(left depth, right depth).",
      "Base case: null node has depth 0.",
    ],
    optimalComplexity: "O(n) time, O(h) space where h = height",
  },

  {
    id: "invert-tree",
    title: "Invert Binary Tree",
    difficulty: "Easy",
    topic: "Trees / DFS",
    roles: ["software", "backend"],
    question: `Given the root of a binary tree, invert it (mirror it) and return its root.`,
    boilerplates: {
      javascript: `function invertTree(root) {\n  // your solution\n}\n`,
      python: `def invert_tree(root):\n    # your solution\n    pass\n`,
      java: `class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        // your solution\n        return null;\n    }\n}`,
    },
    hints: ["Swap left and right children at each node recursively."],
    optimalComplexity: "O(n) time, O(h) space",
  },

  // ── Dynamic Programming ───────────────────────────────────────────────────
  {
    id: "max-subarray",
    title: "Maximum Subarray (Kadane's)",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    roles: ["all"],
    question: `Find the contiguous subarray with the largest sum and return its sum.`,
    boilerplates: {
      javascript: `function maxSubArray(nums) {\n  // can you do it in O(n)?\n}\n\nconsole.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // 6\nconsole.log(maxSubArray([5,4,-1,7,8]));            // 23`,
      python: `def max_sub_array(nums):\n    # can you do it in O(n)?\n    pass\n\nprint(max_sub_array([-2,1,-3,4,-1,2,1,-5,4])) # 6\nprint(max_sub_array([5,4,-1,7,8]))            # 23`,
      java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        // your solution\n        return 0;\n    }\n}`,
    },
    hints: [
      "At each step: extend current subarray or start fresh?",
      "Track currentSum and maxSum.",
    ],
    optimalComplexity: "O(n) time, O(1) space",
  },

  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    topic: "Dynamic Programming / Fibonacci",
    roles: ["all"],
    question: `You are climbing n stairs. Each time you can climb 1 or 2 steps. How many distinct ways can you reach the top?`,
    boilerplates: {
      javascript: `function climbStairs(n) {\n  // your solution\n}\n\nconsole.log(climbStairs(2)); // 2\nconsole.log(climbStairs(3)); // 3\nconsole.log(climbStairs(5)); // 8`,
      python: `def climb_stairs(n):\n    # your solution\n    pass\n\nprint(climb_stairs(2)) # 2\nprint(climb_stairs(3)) # 3\nprint(climb_stairs(5)) # 8`,
      java: `class Solution {\n    public int climbStairs(int n) {\n        return 0;\n    }\n}`,
    },
    hints: [
      "This is Fibonacci. ways(n) = ways(n-1) + ways(n-2).",
      "You only need the last two values.",
    ],
    optimalComplexity: "O(n) time, O(1) space",
  },

  {
    id: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    roles: ["software", "backend", "ml", "data"],
    question: `Given coin denominations and a target amount, find the minimum number of coins to make that amount. Return -1 if impossible.`,
    boilerplates: {
      javascript: `function coinChange(coins, amount) {\n  // your solution\n}\n\nconsole.log(coinChange([1,5,11], 15)); // 3\nconsole.log(coinChange([2], 3));       // -1\nconsole.log(coinChange([1,2,5], 11));  // 3`,
      python: `def coin_change(coins, amount):\n    # your solution\n    pass\n\nprint(coin_change([1,5,11], 15)) # 3\nprint(coin_change([2], 3))       # -1\nprint(coin_change([1,2,5], 11))  # 3`,
      java: `class Solution {\n    public int coinChange(int[] coins, int amount) {\n        return 0;\n    }\n}`,
    },
    hints: [
      "Build dp[0..amount]. dp[i] = min coins to make i.",
      "For each amount i and each coin c: dp[i] = min(dp[i], dp[i-c]+1).",
    ],
    optimalComplexity: "O(amount × coins) time, O(amount) space",
  },

  // ── SQL / Data ────────────────────────────────────────────────────────────
  {
    id: "sql-second-highest",
    title: "Second Highest Salary (SQL)",
    difficulty: "Medium",
    topic: "SQL",
    roles: ["data", "backend", "fullstack"],
    question: `Write a SQL query to find the second highest distinct salary from the Employee table. Return NULL if it doesn't exist.

Schema: Employee(id INT, salary INT)`,
    boilerplates: {
      javascript: `// Write your SQL query as a string
const query = \`
  SELECT MAX(salary) AS SecondHighestSalary
  FROM Employee
  WHERE salary < (SELECT MAX(salary) FROM Employee)
\`;
// Explain your approach below:`,
      python: `# Write your SQL query as a string
query = """\n  -- your SQL here\n"""\n# Explain your approach:`,
      java: `// SQL query:\n// SELECT ...\n// FROM Employee\n// WHERE ...\n\n// Explanation:`,
    },
    hints: [
      "Use a subquery or OFFSET.",
      "DISTINCT matters — what if multiple employees share the max salary?",
    ],
    optimalComplexity: "O(n log n) typical",
  },

  {
    id: "sql-nth-highest",
    title: "Find Employees with Above-Average Salary (SQL)",
    difficulty: "Easy",
    topic: "SQL",
    roles: ["data", "backend", "fullstack"],
    question: `Write a SQL query to find all employees whose salary is above the company average. Include their name and salary, ordered by salary descending.

Schema: Employees(id, name, department, salary)`,
    boilerplates: {
      javascript: `const query = \`\n  SELECT name, salary\n  FROM Employees\n  WHERE salary > -- your condition\n  ORDER BY salary DESC\n\`;`,
      python: `query = """\n  SELECT name, salary\n  FROM Employees\n  WHERE salary > -- your condition\n  ORDER BY salary DESC\n"""`,
      java: `// SQL:\n// SELECT name, salary FROM Employees\n// WHERE salary > ...\n// ORDER BY salary DESC`,
    },
    hints: [
      "The condition should compare against AVG(salary) from the same table.",
      "You can use a subquery: WHERE salary > (SELECT AVG(salary) FROM Employees).",
    ],
    optimalComplexity: "O(n) scan",
  },

  // ── Frontend specific ─────────────────────────────────────────────────────
  {
    id: "debounce",
    title: "Implement Debounce",
    difficulty: "Medium",
    topic: "JavaScript / Closures",
    roles: ["frontend", "fullstack"],
    question: `Implement a \`debounce\` function. It takes a function and a delay in ms, and returns a new function that delays invoking the original until after the delay has elapsed since the last invocation.
  const search = debounce((q) => console.log('searching:', q), 500);
  search('a');  // cancelled
  search('ab'); // cancelled
  search('abc'); // runs after 500ms → logs "searching: abc"`,
    boilerplates: {
      javascript: `function debounce(fn, delay) {\n  // your implementation\n}\n\n// Test:\nconst fn = debounce((x) => console.log(x), 300);\nfn('first');  // should be cancelled\nfn('second'); // should log "second" after 300ms`,
      python: `import threading\n\ndef debounce(fn, delay_ms):\n    # your implementation\n    pass`,
      java: `// Describe your debounce approach and write pseudocode or actual Java`,
    },
    hints: [
      "Use a timer (setTimeout). Cancel the previous timer on each call.",
      "A closure captures the timer reference.",
    ],
    optimalComplexity: "O(1) per call",
  },

  {
    id: "flatten-array",
    title: "Deep Flatten Array",
    difficulty: "Easy",
    topic: "Recursion / Arrays",
    roles: ["frontend", "fullstack"],
    question: `Write a function that deeply flattens a nested array of any depth.`,
    boilerplates: {
      javascript: `function flatten(arr) {\n  // your solution\n}\n\nconsole.log(flatten([1,[2,[3,[4]],5]]));        // [1,2,3,4,5]\nconsole.log(flatten([[1,2],[3,[4,[5]]]]));       // [1,2,3,4,5]`,
      python: `def flatten(arr):\n    # your solution\n    pass\n\nprint(flatten([1,[2,[3,[4]],5]]))   # [1,2,3,4,5]`,
      java: `import java.util.*;\nclass Solution {\n    public List<Integer> flatten(Object[] arr) {\n        // your solution\n        return new ArrayList<>();\n    }\n}`,
    },
    hints: [
      "Check if each element is an array — if so, recurse.",
      "Or use a stack iteratively.",
    ],
    optimalComplexity: "O(n) time where n = total elements",
  },

  // ── Backend specific ──────────────────────────────────────────────────────
  {
    id: "rate-limiter",
    title: "Design a Rate Limiter",
    difficulty: "Medium",
    topic: "Design / Algorithms",
    roles: ["backend", "devops", "cloud"],
    question: `Implement a simple rate limiter class that allows at most N requests per time window (e.g. 5 requests per 10 seconds). Return true if request is allowed, false if rate limited.`,
    boilerplates: {
      javascript: `class RateLimiter {\n  constructor(maxRequests, windowMs) {\n    // your setup\n  }\n\n  allow() {\n    // return true if allowed, false if rate limited\n  }\n}\n\nconst limiter = new RateLimiter(3, 1000);\nconsole.log(limiter.allow()); // true\nconsole.log(limiter.allow()); // true\nconsole.log(limiter.allow()); // true\nconsole.log(limiter.allow()); // false`,
      python: `import time\nfrom collections import deque\n\nclass RateLimiter:\n    def __init__(self, max_requests, window_ms):\n        # your setup\n        pass\n\n    def allow(self):\n        # return True if allowed, False if rate limited\n        pass`,
      java: `import java.util.*;\nclass RateLimiter {\n    public RateLimiter(int maxRequests, long windowMs) {\n        // setup\n    }\n    public boolean allow() {\n        return false;\n    }\n}`,
    },
    hints: [
      "Sliding window approach: store timestamps of requests.",
      "Remove timestamps older than the window before checking count.",
    ],
    optimalComplexity: "O(n) per call where n = requests in window",
  },

  {
    id: "lru-cache",
    title: "LRU Cache",
    difficulty: "Medium",
    topic: "Design / Hash Map + Doubly Linked List",
    roles: ["backend", "software", "fullstack"],
    question: `Design a data structure that follows the Least Recently Used (LRU) cache policy. Implement get and put in O(1) time.

  get(key): Return value if exists, else -1.
  put(key, value): Insert or update. If over capacity, evict the LRU item.`,
    boilerplates: {
      javascript: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    // your setup\n  }\n\n  get(key) {\n    // return value or -1\n  }\n\n  put(key, value) {\n    // insert/update, evict LRU if over capacity\n  }\n}`,
      python: `from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        # your setup\n\n    def get(self, key):\n        pass\n\n    def put(self, key, value):\n        pass`,
      java: `import java.util.*;\nclass LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}`,
    },
    hints: [
      "HashMap gives O(1) lookup. A doubly linked list tracks recency.",
      "Move accessed nodes to front; evict from back.",
    ],
    optimalComplexity: "O(1) get and put",
  },

  // ── ML / Data Science ─────────────────────────────────────────────────────
  {
    id: "moving-average",
    title: "Moving Average of Data Stream",
    difficulty: "Easy",
    topic: "Sliding Window / Queue",
    roles: ["ml", "data", "backend"],
    question: `Given a stream of integers and a window size, calculate the moving average of the last n elements.`,
    boilerplates: {
      javascript: `class MovingAverage {\n  constructor(size) {\n    // your setup\n  }\n  next(val) {\n    // return current average\n  }\n}\n\nconst ma = new MovingAverage(3);\nconsole.log(ma.next(1));  // 1\nconsole.log(ma.next(10)); // 5.5\nconsole.log(ma.next(3));  // 4.667\nconsole.log(ma.next(5));  // 6`,
      python: `from collections import deque\n\nclass MovingAverage:\n    def __init__(self, size):\n        # your setup\n        pass\n\n    def next(self, val):\n        # return current average\n        pass`,
      java: `import java.util.*;\nclass MovingAverage {\n    public MovingAverage(int size) {}\n    public double next(int val) { return 0.0; }\n}`,
    },
    hints: [
      "Use a queue to store the window.",
      "Track the running sum to avoid re-summing each time.",
    ],
    optimalComplexity: "O(1) per next() call",
  },

  // ── DevOps / Cloud ────────────────────────────────────────────────────────
  {
    id: "parse-logs",
    title: "Parse and Aggregate Log Entries",
    difficulty: "Medium",
    topic: "Strings / Hash Map",
    roles: ["devops", "backend", "cloud", "data"],
    question: `Given an array of log strings in the format "HH:MM:SS [LEVEL] message", write a function that:
1. Counts occurrences of each log level (INFO, WARN, ERROR)
2. Returns all ERROR messages
3. Finds the most frequent log level

Example input:
  ["10:00:00 [INFO] Server started",
   "10:00:01 [ERROR] DB connection failed",
   "10:00:02 [WARN] High memory",
   "10:00:03 [ERROR] Timeout"]

Expected output: { counts: {INFO:1, WARN:1, ERROR:2}, errors: [...], mostFrequent: "ERROR" }`,
    boilerplates: {
      javascript: `function parseLogs(logs) {\n  // your solution\n  return { counts: {}, errors: [], mostFrequent: '' };\n}\n\nconst logs = [\n  "10:00:00 [INFO] Server started",\n  "10:00:01 [ERROR] DB connection failed",\n  "10:00:02 [WARN] High memory",\n  "10:00:03 [ERROR] Timeout"\n];\nconsole.log(parseLogs(logs));`,
      python: `def parse_logs(logs):\n    # your solution\n    pass\n\nlogs = [\n    "10:00:00 [INFO] Server started",\n    "10:00:01 [ERROR] DB connection failed",\n    "10:00:02 [WARN] High memory",\n    "10:00:03 [ERROR] Timeout"\n]\nprint(parse_logs(logs))`,
      java: `import java.util.*;\nclass Solution {\n    public Map<String,Object> parseLogs(String[] logs) {\n        // your solution\n        return new HashMap<>();\n    }\n}`,
    },
    hints: ["Extract the level using a regex or string split on [ and ]."],
    optimalComplexity: "O(n) time",
  },
];

/**
 * Map job role keywords to DSA challenge role tags.
 */
function getRoleTag(jobRole) {
  const r = (jobRole || "").toLowerCase();
  if (r.includes("frontend") || r.includes("front-end") || r.includes("ui"))
    return "frontend";
  if (
    r.includes("backend") ||
    r.includes("back-end") ||
    r.includes("api") ||
    r.includes("server")
  )
    return "backend";
  if (r.includes("full") || r.includes("fullstack")) return "fullstack";
  if (
    r.includes("ml") ||
    r.includes("machine") ||
    r.includes("deep learning") ||
    r.includes("ai")
  )
    return "ml";
  if (r.includes("data") || r.includes("analyst") || r.includes("science"))
    return "data";
  if (
    r.includes("devops") ||
    r.includes("cloud") ||
    r.includes("sre") ||
    r.includes("infra")
  )
    return "devops";
  return "software"; // default
}

/**
 * Pick N unique DSA challenges appropriate for the role, shuffled randomly.
 * Prioritises role-specific challenges, fills remainder with 'all'.
 */
export function pickDSAChallenge(askedTopics = []) {
  // Legacy single-pick — not used anymore but kept for compatibility
  const unused = DSA_CHALLENGES.filter(
    (c) => !askedTopics.some((t) => t.includes(c.title) || t.includes(c.id)),
  );
  return unused.length > 0
    ? unused[Math.floor(Math.random() * unused.length)]
    : DSA_CHALLENGES[Math.floor(Math.random() * DSA_CHALLENGES.length)];
}

/**
 * Pick `count` DSA challenges for a given job role.
 * - Prioritises challenges tagged for that role
 * - Falls back to 'all' challenges
 * - Shuffles so each candidate gets a different order
 */
export function pickDSAChallengesForRole(jobRole, count = 5) {
  const roleTag = getRoleTag(jobRole);

  // Separate into role-specific and generic
  const roleSpecific = DSA_CHALLENGES.filter(
    (c) => c.roles.includes(roleTag) && !c.roles.includes("all"),
  );
  const generic = DSA_CHALLENGES.filter((c) => c.roles.includes("all"));
  const other = DSA_CHALLENGES.filter(
    (c) => !c.roles.includes(roleTag) && !c.roles.includes("all"),
  );

  // Shuffle each group
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  // Build pool: role-specific first, then generic, then others as padding
  const pool = [
    ...shuffle(roleSpecific),
    ...shuffle(generic),
    ...shuffle(other),
  ];

  // Deduplicate by id and take count
  const seen = new Set();
  const result = [];
  for (const c of pool) {
    if (!seen.has(c.id)) {
      seen.add(c.id);
      result.push(c);
      if (result.length === count) break;
    }
  }
  return result;
}
