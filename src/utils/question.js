const demoQuestions = [
  {
    id: 1,
    questions: [
      {
        type: "SingleAnswer",
        questionId: 1,
        question: "Solve the equation: 2x + 5 = 15",
        options: {
          a: "x = 5",
          b: "x = 7",
          c: "x = 8",
          d: "x = 10",
        },
        correctAnswer: "a",
      },
    ],
  },
  {
    id: 2,
    questions: [
      {
        type: "SingleAnswer",
        questionId: 1,
        question: "Find the derivative of f(x) = 3x^2 + 2x + 1",
        options: {
          a: "f'(x) = 6x + 2",
          b: "f'(x) = 6x + 1",
          c: "f'(x) = 3x^2 + 2x",
          d: "f'(x) = 6x",
        },
        correctAnswer: "a",
      },
    ],
  },
  {
    id: 3,
    questions: [
      {
        type: "SingleAnswer",
        questionId: 1,
        question: "Evaluate the integral: ∫ (4x^3 + 2x^2 - 5) dx",
        options: {
          a: "(x^4 + (2/3)x^3 - 5x) + C",
          b: "(x^4 + (2/3)x^3 - 5x^2) + C",
          c: "(x^4 + (2/3)x^2 - 5x) + C",
          d: "(x^4 + (1/3)x^3 - 5x) + C",
        },
        correctAnswer: "a",
      },
    ],
  },
  {
    id: 4,
    questions: [
      {
        type: "SingleAnswer",
        questionId: 1,
        question:
          "What is the solution to the system of equations:\n2x - y = 4\nx + y = 3",
        options: {
          a: "x = 2, y = 1",
          b: "x = 1, y = 2",
          c: "x = 3, y = -1",
          d: "x = -1, y = 3",
        },
        correctAnswer: "b",
      },
    ],
  },
  {
    id: 5,
    questions: [
      {
        type: "SingleAnswer",
        questionId: 1,
        question: "Simplify the expression: (3x^2 + 4x - 2) / (x - 1)",
        options: {
          a: "3x + 7 + 5/(x - 1)",
          b: "3x + 7 - 5/(x - 1)",
          c: "3x - 5 + 7/(x - 1)",
          d: "3x - 5 - 7/(x - 1)",
        },
        correctAnswer: "b",
      },
    ],
  },
  {
    id: 6,
    questions: [
      {
        type: "SingleAnswer",
        questionId: 1,
        question: "Find the solution to the inequality: 2x - 7 < 5",
        options: {
          a: "x < 6",
          b: "x > 6",
          c: "x < 1",
          d: "x > 1",
        },
        correctAnswer: "a",
      },
    ],
  },
  {
    id: 7,
    questions: [
      {
        type: "SingleAnswer",
        questionId: 1,
        question:
          "Calculate the determinant of the matrix:\n| 3  1 |\n| 2 -2 |",
        options: {
          a: "-8",
          b: "8",
          c: "10",
          d: "-10",
        },
        correctAnswer: "a",
      },
    ],
  },
  {
    id: 8,
    questions: [
      {
        type: "SingleAnswer",
        questionId: 1,
        question: "Solve the trigonometric equation: sin(x) = 0.5",
        options: {
          a: "x = π/6",
          b: "x = π/4",
          c: "x = π/3",
          d: "x = π/2",
        },
        correctAnswer: "c",
      },
    ],
  },
  {
    id: 9,
    questions: [
      {
        type: "SingleAnswer",
        questionId: 1,
        question: "What is the value of lim(x → 0) (sin(x)/x)?",
        options: {
          a: "0",
          b: "1",
          c: "π",
          d: "∞",
        },
        correctAnswer: "b",
      },
    ],
  },
  {
    id: 10,
    questions: [
      {
        type: "SingleAnswer",
        questionId: 1,
        question: "If f(x) = x^2 + 3x + 2, find the vertex of the parabola.",
        options: {
          a: "(-1, 0)",
          b: "(-3/2, -1/4)",
          c: "(-3/2, -5/4)",
          d: "(-1, -1)",
        },
        correctAnswer: "c",
      },
    ],
  },
  {
    id: 11,
    questions: [
      {
        type: "SingleAnswer",
        questionId: 1,
        question:
          "Determine the eigenvalues of the matrix:\n| 4  1 |\n| 2  3 |",
        options: {
          a: "λ = 1, 6",
          b: "λ = 2, 5",
          c: "λ = 3, 4",
          d: "λ = 1, 3",
        },
        correctAnswer: "a",
      },
    ],
  },
  {
    id: 12,
    questions: [
      {
        type: "SingleAnswer",
        questionId: 1,
        question: "Find the Maclaurin series expansion for e^x.",
        options: {
          a: "1 + x + x^2/2 + x^3/6 + ...",
          b: "1 + x + x^2/2 + x^3/3 + ...",
          c: "1 + x + x^2 + x^3 + ...",
          d: "1 - x + x^2/2 - x^3/6 + ...",
        },
        correctAnswer: "b",
      },
    ],
  },
  {
    id: 13,
    questions: [
      {
        type: "SingleAnswer",
        questionId: 1,
        question: "Evaluate the limit: lim(x → ∞) (2x^2 - 3x + 1) / (4x^2 + 5)",
        options: {
          a: "0",
          b: "1/2",
          c: "2",
          d: "∞",
        },
        correctAnswer: "b",
      },
    ],
  },
  {
    id: 14,
    questions: [
      {
        type: "SingleAnswer",
        questionId: 1,
        question: "Solve the differential equation: dy/dx = 2x",
        options: {
          a: "y = x^2 + C",
          b: "y = x^2/2 + C",
          c: "y = x^2 + 2",
          d: "y = 2x^2 + C",
        },
        correctAnswer: "a",
      },
    ],
  },
  {
    id: 15,
    questions: [
      {
        type: "SingleAnswer",
        questionId: 1,
        question: "What is the value of Σ(k = 1 to 5) k^2?",
        options: {
          a: "25",
          b: "55",
          c: "40",
          d: "15",
        },
        correctAnswer: "a",
      },
    ],
  },
  {
    id: 16,
    questions: [
      {
        type: "SingleAnswer",
        questionId: 1,
        question: "Calculate the Laplace transform of f(t) = 3e^(4t)sin(2t).",
        options: {
          a: "(3s - 4) / (s^2 - 4s - 20)",
          b: "3 / (s^2 - 4s - 20)",
          c: "(3s + 4) / (s^2 - 4s - 20)",
          d: "3 / (s^2 + 4s + 20)",
        },
        correctAnswer: "a",
      },
    ],
  },
  {
    id: 17,
    questions: [
      {
        type: "SingleAnswer",
        questionId: 1,
        question:
          "Determine the area enclosed by the curves y = x^2 and y = 2x - 1.",
        options: {
          a: "5/2",
          b: "8/3",
          c: "11/3",
          d: "14/3",
        },
        correctAnswer: "c",
      },
    ],
  },
  {
    id: 18,
    questions: [
      {
        type: "SingleAnswer",
        questionId: 1,
        question: "If z = 2 + 3i, find the modulus of z.",
        options: {
          a: "2",
          b: "3",
          c: "√13",
          d: "13",
        },
        correctAnswer: "c",
      },
    ],
  },
  {
    id: 19,
    questions: [
      {
        type: "SingleAnswer",
        questionId: 1,
        question:
          "Calculate the probability of rolling a sum of 7 with two six-sided dice.",
        options: {
          a: "1/6",
          b: "1/12",
          c: "1/9",
          d: "1/36",
        },
        correctAnswer: "b",
      },
    ],
  },
  {
    id: 20,
    questions: [
      {
        type: "SingleAnswer",
        questionId: 1,
        question: "Find the inverse function of f(x) = log₄(x).",
        options: {
          a: "f^(-1)(x) = 4^x",
          b: "f^(-1)(x) = 4/x",
          c: "f^(-1)(x) = log₄(1/x)",
          d: "f^(-1)(x) = log₄(x)/x",
        },
        correctAnswer: "a",
      },
    ],
  },
];

module.exports = demoQuestions;
