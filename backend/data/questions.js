const questions = [
  {
    question: "What is the time complexity of binary search on a sorted array?",

    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],

    answer: "O(log n)",

    explanation:
      "Binary search divides the search space into half at every step.",

    subject: "DSA",
    difficulty: "Easy",
  },

  {
    question: "Which data structure follows the LIFO principle?",

    options: ["Queue", "Stack", "Linked List", "Tree"],

    answer: "Stack",

    explanation: "Stack follows Last In First Out (LIFO).",

    subject: "DSA",
    difficulty: "Easy",
  },

  {
    question: "Which keyword is used to inherit a class in Java?",

    options: ["implements", "extends", "inherits", "super"],

    answer: "extends",

    explanation: "Java uses the extends keyword for class inheritance.",

    subject: "Java",
    difficulty: "Easy",
  },

  {
    question: "Which normal form removes partial dependency?",

    options: ["1NF", "2NF", "3NF", "BCNF"],

    answer: "2NF",

    explanation: "2NF removes partial dependency on a composite key.",

    subject: "DBMS",
    difficulty: "Medium",
  },

  {
    question: "Which scheduling algorithm uses a time quantum?",

    options: ["FCFS", "SJF", "Round Robin", "Priority Scheduling"],

    answer: "Round Robin",

    explanation: "Round Robin assigns each process a fixed time quantum.",

    subject: "Operating Systems",
    difficulty: "Medium",
  },

  {
    question:
      "Which keyword declares a variable that cannot be reassigned in JavaScript?",

    options: ["var", "let", "const", "static"],

    answer: "const",

    explanation: "const creates a binding that cannot be reassigned.",

    subject: "JavaScript",
    difficulty: "Easy",
  },

  {
    question: "Which OOP concept allows the same method to behave differently?",

    options: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"],

    answer: "Polymorphism",

    explanation:
      "Polymorphism allows different implementations through the same interface.",

    subject: "OOP",
    difficulty: "Easy",
  },

  {
    question: "Which protocol provides secure communication over HTTP?",

    options: ["FTP", "HTTP", "HTTPS", "SMTP"],

    answer: "HTTPS",

    explanation: "HTTPS uses TLS encryption for secure HTTP communication.",

    subject: "Computer Networks",
    difficulty: "Easy",
  },

  {
    question: "Which symbol is used for a single-line comment in Python?",

    options: ["//", "#", "/*", "<!--"],

    answer: "#",

    explanation: "Python uses # for single-line comments.",

    subject: "Python",
    difficulty: "Easy",
  },

  {
    question: "Which SQL command retrieves data from a database?",

    options: ["GET", "SELECT", "FETCH", "RETRIEVE"],

    answer: "SELECT",

    explanation: "SELECT is used to retrieve data from database tables.",

    subject: "SQL",
    difficulty: "Easy",
  },
];

module.exports = questions;
