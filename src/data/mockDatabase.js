// Mock Database for TSA System
// This simulates a real database with persistent storage using localStorage

class MockDatabase {
  constructor() {
    this.initializeData();
  }

  // Initialize default data if not exists
  initializeData() {
    if (!localStorage.getItem('tsa_users')) {
      localStorage.setItem('tsa_users', JSON.stringify(this.getDefaultUsers()));
    }
    if (!localStorage.getItem('tsa_questions')) {
      localStorage.setItem('tsa_questions', JSON.stringify(this.getDefaultQuestions()));
    }
    if (!localStorage.getItem('tsa_exams')) {
      localStorage.setItem('tsa_exams', JSON.stringify(this.getDefaultExams()));
    }
    if (!localStorage.getItem('tsa_exam_results')) {
      localStorage.setItem('tsa_exam_results', JSON.stringify([]));
    }
    if (!localStorage.getItem('tsa_next_ids')) {
      localStorage.setItem('tsa_next_ids', JSON.stringify({
        user: 6,
        question: 22,
        exam: 4,
        result: 1
      }));
    }
  }

  // Default Users
  getDefaultUsers() {
    return [
      {
        id: 1,
        email: "admin@tsa.com",
        password: "admin123",
        role: "admin",
        name: "Admin TSA",
        createdAt: "2024-01-01",
        isActive: true
      },
      {
        id: 2,
        email: "student1@gmail.com",
        password: "123456",
        role: "student",
        name: "Nguyễn Văn An",
        createdAt: "2024-01-10",
        isActive: true
      },
      {
        id: 3,
        email: "student2@gmail.com",
        password: "123456",
        role: "student",
        name: "Trần Thị Bình",
        createdAt: "2024-01-11",
        isActive: true
      },
      {
        id: 4,
        email: "student3@gmail.com",
        password: "123456",
        role: "student",
        name: "Lê Văn Cường",
        createdAt: "2024-01-12",
        isActive: true
      },
      {
        id: 5,
        email: "demo@test.com",
        password: "demo123",
        role: "student",
        name: "Demo User",
        createdAt: "2024-01-15",
        isActive: true
      }
    ];
  }

  // Default Questions (20 câu toán)
  getDefaultQuestions() {
    return [
      {
        id: 1,
        question: "Giải phương trình: $2x + 5 = 15$",
        type: "SingleAnswer",
        options: {
          a: "$x = 5$",
          b: "$x = 10$",
          c: "$x = 7$",
          d: "$x = 3$"
        },
        correctAnswer: "a",
        difficulty: "easy",
        subject: "math_thinking",
        explanation: "Ta có: $2x + 5 = 15 \\Rightarrow 2x = 10 \\Rightarrow x = 5$",
        createdAt: "2024-01-15"
      },
      {
        id: 2,
        question: "Tính đạo hàm của hàm số $f(x) = 3x^2 + 2x - 1$",
        type: "SingleAnswer",
        options: {
          a: "$f'(x) = 6x + 2$",
          b: "$f'(x) = 6x - 2$",
          c: "$f'(x) = 3x + 2$",
          d: "$f'(x) = 6x + 1$"
        },
        correctAnswer: "a",
        difficulty: "medium",
        subject: "math_thinking",
        explanation: "Áp dụng quy tắc đạo hàm: $(ax^n)' = nax^{n-1}$",
        createdAt: "2024-01-14"
      },
      {
        id: 3,
        question: "Tính giá trị của biểu thức: $\\sqrt{16} + \\sqrt{25}$",
        type: "SingleAnswer",
        options: {
          a: "$9$",
          b: "$8$",
          c: "$7$",
          d: "$10$"
        },
        correctAnswer: "a",
        difficulty: "easy",
        subject: "math_thinking",
        explanation: "$\\sqrt{16} = 4$ và $\\sqrt{25} = 5$, nên $4 + 5 = 9$",
        createdAt: "2024-01-13"
      },
      {
        id: 4,
        question: "Phương trình $x^2 - 5x + 6 = 0$ có nghiệm là:",
        type: "MultipleAnswers",
        options: {
          a: "$x = 2$",
          b: "$x = 3$",
          c: "$x = 1$",
          d: "$x = 6$"
        },
        correctAnswer: ["a", "b"],
        difficulty: "medium",
        subject: "math_thinking",
        explanation: "Phân tích: $(x-2)(x-3) = 0 \\Rightarrow x = 2$ hoặc $x = 3$",
        createdAt: "2024-01-12"
      },
      {
        id: 5,
        question: "Tính tích phân: $\\int_0^2 x dx$",
        type: "SingleAnswer",
        options: {
          a: "$2$",
          b: "$4$",
          c: "$1$",
          d: "$3$"
        },
        correctAnswer: "a",
        difficulty: "hard",
        subject: "math_thinking",
        explanation: "$\\int_0^2 x dx = \\frac{x^2}{2}\\Big|_0^2 = \\frac{4}{2} - 0 = 2$",
        createdAt: "2024-01-11"
      },
      {
        id: 6,
        question: "Trong tam giác vuông, nếu hai cạnh góc vuông có độ dài 3 và 4 thì cạnh huyền có độ dài:",
        type: "SingleAnswer",
        options: {
          a: "$5$",
          b: "$7$",
          c: "$6$",
          d: "$8$"
        },
        correctAnswer: "a",
        difficulty: "easy",
        subject: "math_thinking",
        explanation: "Theo định lý Pythagoras: $c^2 = 3^2 + 4^2 = 9 + 16 = 25 \\Rightarrow c = 5$",
        createdAt: "2024-01-10"
      },
      {
        id: 7,
        question: "Giá trị của $\\log_2 8$ là:",
        type: "SingleAnswer",
        options: {
          a: "$3$",
          b: "$2$",
          c: "$4$",
          d: "$1$"
        },
        correctAnswer: "a",
        difficulty: "medium",
        subject: "math_thinking",
        explanation: "$\\log_2 8 = \\log_2 2^3 = 3$",
        createdAt: "2024-01-09"
      },
      {
        id: 8,
        question: "Hàm số $y = x^2 - 4x + 3$ có đỉnh parabol tại điểm:",
        type: "SingleAnswer",
        options: {
          a: "$(2, -1)$",
          b: "$(1, 0)$",
          c: "$(3, 0)$",
          d: "$(2, 1)$"
        },
        correctAnswer: "a",
        difficulty: "medium",
        subject: "math_thinking",
        explanation: "Đỉnh parabol: $x = -\\frac{b}{2a} = -\\frac{-4}{2} = 2$, $y = 4 - 8 + 3 = -1$",
        createdAt: "2024-01-08"
      },
      {
        id: 9,
        question: "Số nghiệm của phương trình $\\sin x = \\frac{1}{2}$ trong khoảng $[0, 2\\pi]$ là:",
        type: "SingleAnswer",
        options: {
          a: "$2$",
          b: "$1$",
          c: "$3$",
          d: "$4$"
        },
        correctAnswer: "a",
        difficulty: "medium",
        subject: "math_thinking",
        explanation: "$\\sin x = \\frac{1}{2} \\Rightarrow x = \\frac{\\pi}{6}$ hoặc $x = \\frac{5\\pi}{6}$",
        createdAt: "2024-01-07"
      },
      {
        id: 10,
        question: "Tính giới hạn: $\\lim_{x \\to 0} \\frac{\\sin x}{x}$",
        type: "SingleAnswer",
        options: {
          a: "$1$",
          b: "$0$",
          c: "$\\infty$",
          d: "Không tồn tại"
        },
        correctAnswer: "a",
        difficulty: "hard",
        subject: "math_thinking",
        explanation: "Đây là giới hạn cơ bản: $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$",
        createdAt: "2024-01-06"
      },
      {
        id: 11,
        question: "Ma trận $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ có định thức bằng:",
        type: "SingleAnswer",
        options: {
          a: "$-2$",
          b: "$2$",
          c: "$10$",
          d: "$-10$"
        },
        correctAnswer: "a",
        difficulty: "medium",
        subject: "math_thinking",
        explanation: "$\\det(A) = 1 \\cdot 4 - 2 \\cdot 3 = 4 - 6 = -2$",
        createdAt: "2024-01-05"
      },
      {
        id: 12,
        question: "Số cách chọn 3 học sinh từ 5 học sinh là:",
        type: "SingleAnswer",
        options: {
          a: "$10$",
          b: "$15$",
          c: "$20$",
          d: "$60$"
        },
        correctAnswer: "a",
        difficulty: "medium",
        subject: "math_thinking",
        explanation: "$C_5^3 = \\frac{5!}{3!(5-3)!} = \\frac{5!}{3!2!} = \\frac{5 \\cdot 4}{2 \\cdot 1} = 10$",
        createdAt: "2024-01-04"
      },
      {
        id: 13,
        question: "Phương trình đường thẳng đi qua hai điểm $A(1,2)$ và $B(3,6)$ là:",
        type: "SingleAnswer",
        options: {
          a: "$y = 2x$",
          b: "$y = x + 1$",
          c: "$y = 3x - 1$",
          d: "$y = 2x - 1$"
        },
        correctAnswer: "a",
        difficulty: "medium",
        subject: "math_thinking",
        explanation: "Hệ số góc: $k = \\frac{6-2}{3-1} = 2$. Phương trình: $y - 2 = 2(x - 1) \\Rightarrow y = 2x$",
        createdAt: "2024-01-03"
      },
      {
        id: 14,
        question: "Tập nghiệm của bất phương trình $x^2 - 4 < 0$ là:",
        type: "SingleAnswer",
        options: {
          a: "$(-2, 2)$",
          b: "$(-\\infty, -2) \\cup (2, +\\infty)$",
          c: "$[-2, 2]$",
          d: "$\\mathbb{R}$"
        },
        correctAnswer: "a",
        difficulty: "medium",
        subject: "math_thinking",
        explanation: "$x^2 - 4 < 0 \\Leftrightarrow (x-2)(x+2) < 0 \\Leftrightarrow -2 < x < 2$",
        createdAt: "2024-01-02"
      },
      {
        id: 15,
        question: "Diện tích hình tròn có bán kính $r = 3$ là:",
        type: "SingleAnswer",
        options: {
          a: "$9\\pi$",
          b: "$6\\pi$",
          c: "$3\\pi$",
          d: "$12\\pi$"
        },
        correctAnswer: "a",
        difficulty: "easy",
        subject: "math_thinking",
        explanation: "Diện tích hình tròn: $S = \\pi r^2 = \\pi \\cdot 3^2 = 9\\pi$",
        createdAt: "2024-01-01"
      },
      {
        id: 16,
        question: "Số phức $z = 3 + 4i$ có mô-đun bằng:",
        type: "SingleAnswer",
        options: {
          a: "$5$",
          b: "$7$",
          c: "$\\sqrt{7}$",
          d: "$25$"
        },
        correctAnswer: "a",
        difficulty: "medium",
        subject: "math_thinking",
        explanation: "$|z| = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$",
        createdAt: "2023-12-31"
      },
      {
        id: 17,
        question: "Đạo hàm của $\\ln(x)$ là:",
        type: "SingleAnswer",
        options: {
          a: "$\\frac{1}{x}$",
          b: "$x$",
          c: "$\\ln(x)$",
          d: "$e^x$"
        },
        correctAnswer: "a",
        difficulty: "easy",
        subject: "math_thinking",
        explanation: "Đạo hàm của logarithm tự nhiên: $(\\ln x)' = \\frac{1}{x}$",
        createdAt: "2023-12-30"
      },
      {
        id: 18,
        question: "Trong cấp số cộng với $u_1 = 2$ và $d = 3$, số hạng thứ 5 là:",
        type: "SingleAnswer",
        options: {
          a: "$14$",
          b: "$17$",
          c: "$11$",
          d: "$20$"
        },
        correctAnswer: "a",
        difficulty: "easy",
        subject: "math_thinking",
        explanation: "$u_5 = u_1 + 4d = 2 + 4 \\cdot 3 = 2 + 12 = 14$",
        createdAt: "2023-12-29"
      },
      {
        id: 19,
        question: "Phương trình $2^x = 8$ có nghiệm:",
        type: "SingleAnswer",
        options: {
          a: "$x = 3$",
          b: "$x = 4$",
          c: "$x = 2$",
          d: "$x = 8$"
        },
        correctAnswer: "a",
        difficulty: "easy",
        subject: "math_thinking",
        explanation: "$2^x = 8 = 2^3 \\Rightarrow x = 3$",
        createdAt: "2023-12-28"
      },
      {
        id: 20,
        question: "Tính tổng: $1 + 2 + 3 + ... + 100$",
        type: "SingleAnswer",
        options: {
          a: "$5050$",
          b: "$5000$",
          c: "$5100$",
          d: "$4950$"
        },
        correctAnswer: "a",
        difficulty: "medium",
        subject: "math_thinking",
        explanation: "Công thức tổng: $S_n = \\frac{n(n+1)}{2} = \\frac{100 \\cdot 101}{2} = 5050$",
        createdAt: "2023-12-27"
      },
      {
        id: 21,
        question: "Cho hàm số $y = f(x)$ có đồ thị trên đoạn $[-2, 4]$ như hình vẽ. Giá trị lớn nhất của hàm số $y = f'(|x|)$ trên đoạn $[-2, 4]$ là:",
        type: "SingleAnswer",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8IS0tIEdyaWQgLS0+CiAgPGRlZnM+CiAgICA8cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHBhdGggZD0iTSAyMCAwIEwgMCAwIDAgMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2VlZSIgc3Ryb2tlLXdpZHRoPSIxIi8+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz4KICA8IS0tIEF4ZXMgLS0+CiAgPGxpbmUgeDE9IjUwIiB5MT0iMjUwIiB4Mj0iMzUwIiB5Mj0iMjUwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8bGluZSB4MT0iMjAwIiB5MT0iNTAiIHgyPSIyMDAiIHkyPSIyNzAiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIvPgogIDwhLS0gQXJyb3dzIC0tPgogIDxwb2x5Z29uIHBvaW50cz0iMzUwLDI1MCAzNDAsMjQ1IDM0MCwyNTUiIGZpbGw9ImJsYWNrIi8+CiAgPHBvbHlnb24gcG9pbnRzPSIyMDAsNTAgMTk1LDYwIDIwNSw2MCIgZmlsbD0iYmxhY2siLz4KICA8IS0tIExhYmVscyAtLT4KICA8dGV4dCB4PSIzNjAiIHk9IjI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0Ij54PC90ZXh0PgogIDx0ZXh0IHg9IjIwNSIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCI+eTwvdGV4dD4KICA8dGV4dCB4PSIxOTUiIHk9IjI3MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIj5PPC90ZXh0PgogIDwhLS0gTnVtYmVycyAtLT4KICA8dGV4dCB4PSIxMDAiIHk9IjI3MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIj4tMjwvdGV4dD4KICA8dGV4dCB4PSIxNDUiIHk9IjI3MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIj4tMTwvdGV4dD4KICA8dGV4dCB4PSIyNTAiIHk9IjI3MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIj4yPC90ZXh0PgogIDx0ZXh0IHg9IjMwMCIgeT0iMjcwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPjQ8L3RleHQ+CiAgPHRleHQgeD0iMTgwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+MTwvdGV4dD4KICA8dGV4dCB4PSIxODAiIHk9IjE1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIj4yPC90ZXh0PgogIDx0ZXh0IHg9IjE4MCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPi0zPC90ZXh0PgogIDwhLS0gRnVuY3Rpb24gZ3JhcGggLS0+CiAgPHBhdGggZD0iTSAxMDAsMzAwIEwgMTUwLDIwMCBMIDIwMCwxNTAgTCAyNTAsMjAwIEwgMzAwLDMwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibHVlIiBzdHJva2Utd2lkdGg9IjMiLz4KICA8IS0tIFBvaW50cyAtLT4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIzMDAiIHI9IjQiIGZpbGw9ImJsdWUiLz4KICA8Y2lyY2xlIGN4PSIxNTAiIGN5PSIyMDAiIHI9IjQiIGZpbGw9ImJsdWUiLz4KICA8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNTAiIHI9IjQiIGZpbGw9ImJsdWUiLz4KICA8Y2lyY2xlIGN4PSIyNTAiIGN5PSIyMDAiIHI9IjQiIGZpbGw9ImJsdWUiLz4KICA8Y2lyY2xlIGN4PSIzMDAiIGN5PSIzMDAiIHI9IjQiIGZpbGw9ImJsdWUiLz4KPC9zdmc+",
        options: {
          a: "$f(-2)$",
          b: "$f(1)$",
          c: "$2$",
          d: "$f(-1)$"
        },
        correctAnswer: "c",
        difficulty: "hard",
        subject: "math_thinking",
        explanation: "Từ đồ thị ta thấy hàm số đạt giá trị lớn nhất tại x = 0 với giá trị y = 2",
        createdAt: "2023-12-26"
      }
    ];
  }

  // Default Exams
  getDefaultExams() {
    return [
      {
        id: 1,
        title: "Đề thi TSA Toán học - Đợt 1/2024",
        description: "Đề thi đánh giá tư duy toán học chính thức đợt 1 năm 2024. Bao gồm các câu hỏi từ cơ bản đến nâng cao về đại số, hình học và giải tích.",
        duration: 90,
        totalQuestions: 40,
        questionIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        difficulty: "mixed",
        subject: "math_thinking",
        status: "active",
        createdAt: "2024-01-15",
        createdBy: "admin",
        settings: {
          shuffleQuestions: true,
          showResults: true,
          allowReview: false,
          passingScore: 60,
        }
      },
      {
        id: 2,
        title: "Thi thử Tư duy Toán học - Cơ bản",
        description: "Đề thi thử dành cho học sinh muốn làm quen với format thi TSA. Tập trung vào các kiến thức toán học cơ bản.",
        duration: 60,
        totalQuestions: 10,
        questionIds: [1, 3, 6, 15, 17, 18, 19, 7, 12, 13],
        difficulty: "easy",
        subject: "math_thinking",
        status: "active",
        createdAt: "2024-01-10",
        createdBy: "admin",
        settings: {
          shuffleQuestions: false,
          showResults: true,
          allowReview: true,
          passingScore: 50,
        }
      },
      {
        id: 3,
        title: "Đề thi Tư duy Toán học - Nâng cao",
        description: "Đề thi dành cho học sinh có nền tảng toán học vững chắc. Bao gồm các bài toán phức tạp về giải tích và đại số.",
        duration: 120,
        totalQuestions: 15,
        questionIds: [2, 4, 5, 8, 9, 10, 11, 14, 16, 20, 7, 12, 13, 6, 15],
        difficulty: "hard",
        subject: "math_thinking",
        status: "active",
        createdAt: "2024-01-05",
        createdBy: "admin",
        settings: {
          shuffleQuestions: true,
          showResults: true,
          allowReview: false,
          passingScore: 70,
        }
      }
    ];
  }

  // CRUD Operations
  getUsers() {
    return JSON.parse(localStorage.getItem('tsa_users') || '[]');
  }

  getQuestions() {
    return JSON.parse(localStorage.getItem('tsa_questions') || '[]');
  }

  getExams() {
    return JSON.parse(localStorage.getItem('tsa_exams') || '[]');
  }

  getExamResults() {
    return JSON.parse(localStorage.getItem('tsa_exam_results') || '[]');
  }

  // Save methods
  saveUsers(users) {
    localStorage.setItem('tsa_users', JSON.stringify(users));
  }

  saveQuestions(questions) {
    localStorage.setItem('tsa_questions', JSON.stringify(questions));
  }

  saveExams(exams) {
    localStorage.setItem('tsa_exams', JSON.stringify(exams));
  }

  saveExamResults(results) {
    localStorage.setItem('tsa_exam_results', JSON.stringify(results));
  }

  // Get next ID
  getNextId(type) {
    const ids = JSON.parse(localStorage.getItem('tsa_next_ids') || '{}');
    const nextId = ids[type] || 1;
    ids[type] = nextId + 1;
    localStorage.setItem('tsa_next_ids', JSON.stringify(ids));
    return nextId;
  }

  // Reset database
  resetDatabase() {
    localStorage.removeItem('tsa_users');
    localStorage.removeItem('tsa_questions');
    localStorage.removeItem('tsa_exams');
    localStorage.removeItem('tsa_exam_results');
    localStorage.removeItem('tsa_next_ids');
    this.initializeData();
  }

  // Force initialize (for debugging)
  forceInitialize() {
    this.resetDatabase();
    console.log("Database force initialized");
    console.log("Exams:", this.getExams());
    console.log("Questions:", this.getQuestions());
    console.log("Users:", this.getUsers());
  }
}

export default new MockDatabase();
