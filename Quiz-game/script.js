// DOM elements
const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');

const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const questionText = document.getElementById('question-text');
const currQue = document.getElementById('curr-que');
const totalQue = document.getElementById('total-que');
const scoreSpan = document.getElementById('score');
const ansContainer = document.getElementById('ans-container');
const progress = document.getElementById('progress');

const finalScore = document.getElementById('final-score');
const maxScore = document.getElementById('max-score');
const resultMsg = document.getElementById('result-msg');
const restartBtn = document.getElementById('restart-btn');


// =======================
// API FETCH FUNCTION
// =======================
async function fetchQuizData() {
  try {
    const response = await fetch("https://opentdb.com/api.php?amount=10");

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    if (data.response_code !== 0) {
      throw new Error(`API Error: ${data.response_code}`);
    }

    return data.results;
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

// =======================
// FORMAT QUESTIONS
// =======================
function formatQuestions(rawQuestions) {
  return rawQuestions.map((q) => {
    const answers = [
      ...q.incorrect_answers.map((ans) => ({
        text: ans,
        correct: false,
      })),
      {
        text: q.correct_answer,
        correct: true,
      },
    ];

    // Shuffle answers
    answers.sort(() => Math.random() - 0.5);

    return {
      question: q.question,
      answers: answers,
    };
  });
}

// =======================
// QUIZ STATE
// =======================
let quizQuestions = [];
let currQuestionIndex = 0;
let score = 0;
let answersdisabled = false;


// =======================
// START QUIZ
// =======================
function startQuiz() {
    currQuestionIndex = 0;
    score = 0;

    scoreSpan.textContent = score;

    startScreen.classList.remove("active");
    quizScreen.classList.add("active");

    showQuestion();
}


// =======================
// SHOW QUESTION
// =======================
function showQuestion() {
    answersdisabled = false;

    const currentQuestion = quizQuestions[currQuestionIndex];

    currQue.textContent = currQuestionIndex + 1;

    const progressPercent = ((currQuestionIndex + 1) / quizQuestions.length) * 100;
    progress.style.width = progressPercent + "%";

    questionText.innerHTML = currentQuestion.question;

    // 🔥 CLEAR OLD ANSWERS
    ansContainer.innerHTML = "";

    currentQuestion.answers.forEach(ans => {
        const button = document.createElement("button");
        button.textContent = ans.text;
        button.classList.add("ans-btn");
        button.dataset.correct = ans.correct;

        button.addEventListener("click", selectAnswer);

        ansContainer.appendChild(button);
    });
}


// =======================
// SELECT ANSWER
// =======================
function selectAnswer(event) {
    if (answersdisabled) return;

    answersdisabled = true;

    const selectedButton = event.target;
    const isCorrect = selectedButton.dataset.correct === "true";

    // Highlight answers properly
    Array.from(ansContainer.children).forEach(btn => {
        if (btn.dataset.correct === "true") {
            btn.classList.add("correct"); // always show correct
        }
    });

    // If selected is wrong → mark only that one red
    if (!isCorrect) {
        selectedButton.classList.add("incorrect");
    }

    // Update score
    if (isCorrect) {
        score++;
        scoreSpan.textContent = score;
    }

    // Move to next
    setTimeout(() => {
        currQuestionIndex++;

        if (currQuestionIndex < quizQuestions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }, 1000);
}


// =======================
// SHOW RESULT
// =======================
function showResult() {
    quizScreen.classList.remove("active");
    resultScreen.classList.add("active");

    finalScore.textContent = score;

    const scorePercent = (score / quizQuestions.length) * 100;

    if (scorePercent >= 80) {
        resultMsg.textContent = "🔥 Excellent!";
    } else if (scorePercent >= 50) {
        resultMsg.textContent = "👍 Good job!";
    } else {
        resultMsg.textContent = "😅 Keep practicing!";
    }
}


// =======================
// RESTART
// =======================
function restartQuiz() {
    resultScreen.classList.remove("active");
    initQuiz()
}


// =======================
// INIT
// =======================
async function initQuiz() {
    try {
        const rawData = await fetchQuizData();
        quizQuestions = formatQuestions(rawData);
        console.log(quizQuestions);
        

        totalQue.textContent = quizQuestions.length;
        maxScore.textContent = quizQuestions.length;

        startBtn.addEventListener("click", startQuiz);
        restartBtn.addEventListener("click", restartQuiz);

    } catch (error) {
        console.error("Initialization Error:", error);
    }
}

initQuiz();