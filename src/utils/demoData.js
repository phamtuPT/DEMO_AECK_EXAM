const demoQuestions = [
  {
    id: 1,
    questions: [
      {
        type: "Dragging",
        questionId: 1,
        question: "Vietnam is a [[1]] country located in [[2]]",
        options: {
          a: "Tropical",
          b: "Temperate",
          c: "Asia",
          d: "Europe",
          e: "Americas",
        },
        correctAnswers: ["a", "c"],
      },
      {
        type: "SingleAnswer",
        questionId: 2,
        question: "Which side does the sun rise on?",
        options: {
          a: "East",
          b: "West",
          c: "South",
          d: "North",
        },
        correctAnswer: "a",
      },
      {
        type: "MultipleAnswers",
        questionId: 3,
        question: "Which of the following are greenhouse gases?",
        options: {
          a: "Carbon dioxide (CO2)",
          b: "Nitrous oxide (N2O)",
          c: "Methane (CH4)",
          d: "Oxygen (O2)",
        },
        correctAnswers: ["a", "b", "c"],
      },
      {
        type: "True/False",
        questionId: 4,
        question: [
          {
            id: 1,
            questionContent: "The Earth orbits the Moon.",
            correctAnswer: "False",
          },
          {
            id: 2,
            questionContent: "Water boils at 100 degrees Celsius at sea level.",
            correctAnswer: "True",
          },
          {
            id: 3,
            questionContent:
              "DNA is composed of two strands that form a double helix structure.",
            correctAnswer: "True",
          },
          {
            id: 4,
            questionContent:
              "The Great Wall of China is visible from space with the naked eye",
            correctAnswer: "False",
          },
          {
            id: 5,
            questionContent:
              "Photosynthesis is the process by which plants convert carbon dioxide into oxygen.",
            correctAnswer: "True",
          },
        ],
      },
      {
        type: "ConstructedResponse",
        questionId: 5,
        question: "Vietnam is a [[1]] country located in [[2]]",
        correctAnswers: ["tropical", "asia"],
      },
      {
        type: "SingleAnswer",
        questionId: 6,
        question: "Which side does the sun rise on?",
        options: {
          a: "East",
          b: "West",
          c: "South",
          d: "North",
        },
        correctAnswer: "a",
      },
    ],
  },
  {
    id: 2,
    questions: [
      {
        type: "Dragging",
        questionId: 1,
        question: "EastLao is a [[1]] country located in [[2]]",
        options: {
          a: "Tropical",
          b: "Temperate",
          c: "Asia",
          d: "Europe",
          e: "Americas",
        },
        correctAnswers: ["a", "c"],
      },
      {
        type: "SingleAnswer",
        questionId: 2,
        question: "Which side does the sun rise on?",
        options: {
          a: "East",
          b: "West",
          c: "South",
          d: "North",
        },
        correctAnswer: "a",
      },
      {
        type: "MultipleAnswers",
        questionId: 3,
        question: "Which of the following are greenhouse gases?",
        options: {
          a: "Carbon dioxide (CO2)",
          b: "Nitrous oxide (N2O)",
          c: "Methane (CH4)",
          d: "Oxygen (O2)",
        },
        correctAnswers: ["a", "b", "c"],
      },
      {
        type: "True/False",
        questionId: 4,
        question: [
          {
            id: 1,
            questionContent: "The Earth orbits the Moon.",
            correctAnswer: "False",
          },
          {
            id: 2,
            questionContent: "Water boils at 100 degrees Celsius at sea level.",
            correctAnswer: "True",
          },
          {
            id: 3,
            questionContent:
              "DNA is composed of two strands that form a double helix structure.",
            correctAnswer: "True",
          },
          {
            id: 4,
            questionContent:
              "The Great Wall of China is visible from space with the naked eye",
            correctAnswer: "False",
          },
          {
            id: 5,
            questionContent:
              "Photosynthesis is the process by which plants convert carbon dioxide into oxygen.",
            correctAnswer: "True",
          },
        ],
      },
      {
        type: "ConstructedResponse",
        questionId: 5,
        question: "Vietnam is a [[1]] country located in [[2]]",
        correctAnswers: ["tropical", "asia"],
      },
    ],
  },
];

export default demoQuestions;
