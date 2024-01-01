// Get references to HTML elements
const stopWatch = document.getElementById('time');
const questionElement = document.querySelector('#question-title');
const answerChoices = document.querySelector('#choices');
const startButton = document.getElementById('start');
const nextQuestionButton = document.querySelector('.next-question');

// Initialize variables
let quizData = [];
let questionIndex = 0;
let timer;
let clock = 30;
stopWatch.textContent = 30
nextQuestionButton.style.display = `none`

// Function to display a question
function displayQuestion(array, index) {
  questionElement.textContent = array[index].question;

  // Create buttons for each answer
  array[index].answers.forEach((value) => {
    const answerOption = document.createElement('button');
    answerOption.textContent = value;
    answerChoices.appendChild(answerOption);
  });
}

// Function to remove the previous question's answer choices
function nextQuestion() {
  answerChoices.innerHTML = ''; // Clear answer choices directly
}

// Event listener for the "Start Quiz" button
startButton.addEventListener('click', function () {
  // Hide the start-screen
  document.getElementById('start-screen').classList.add('hide');
  
  // Display the questions
  document.getElementById('questions').classList.remove('hide');

  // Populate quizData before displaying questions
  quizData = [
    {
      question: 'What is the result of true && false?',
      answers: ['True', 'False', 'true and false', 'undefined'],
      correctAnswer: 'False',
    },
    {
      question: `Which of the following values is considered falsy in JavaScript?`,
      answers: [`0`, `"false"`, `true` , `All of the above`],
      correctAnswer:`0`,
    },
    {
      question: `What is a callback function in JavaScript?`,
      answers: [
        `function that calls another function`,
        `function passed as an argument to another function`,
        `function that returns another function`,
        `function that performs mathematical calculations`,
      ],
      correctAnswer: `function passed as an argument to another function`
    },
    {
      question: `What is the result of [1, 2, 3] + [4, 5, 6]?`,
      answers: [[1, 2, 3, 4, 5, 6], `123456`, [5, 7, 9], `error`],
      correctAnswer: '123456',
    },
    {
      question: `What does the splice method do in JavaScript?`,
      answers: [
        `Removes elements from an array`,
        `Adds elements to an array`,
        `Both A and B`,
        `None of the above`,
      ],
      correctAnswer: `Both A and B`,
    },
  ];

  // Display the first question (now that quizData has data)
  displayQuestion(quizData, questionIndex);

  // Set up the timer
  timer = setInterval(() => {
    stopWatch.textContent = clock;
    clock--;

    // Check if time is up or there are no more questions
    if (clock < 0 || questionIndex >= quizData.length) {
      clearInterval(timer);
      stopWatch.textContent = 'Time is up!';
      endQuiz();
    }
  }, 1000);
});

// Event listener for answer choices
answerChoices.addEventListener('click', (e) => {
    const currentQuestion = quizData[questionIndex];
  
    if (currentQuestion && currentQuestion.correctAnswer !== undefined) {
      const correctAnswer = currentQuestion.correctAnswer;
  
      if (e.target.matches('button')) {
        if (e.target.textContent === correctAnswer) {
          e.target.style.backgroundColor = 'lightgreen';
        } else {
          e.target.style.backgroundColor = 'red';
          displayFeedback('Incorrect');
          clock -= 5;
        }
  
        // Update the selectedAnswer property
        currentQuestion.selectedAnswer = e.target.textContent;
  
        setTimeout(() => {
          questionIndex++;
  
          if (questionIndex < quizData.length) {
            nextQuestion();
            displayQuestion(quizData, questionIndex);
          } else {
            endQuiz();
          }
        }, 200);
      }
    }
  });
  
  // Function to display feedback message
  function displayFeedback(message) {
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = message;
  
    // You can remove the feedback message after a certain time if desired
    setTimeout(() => {
      feedbackElement.textContent = '';
    }, 2000); // Remove the feedback after 2 seconds (adjust as needed)
  }
  
  
  

// Event listener for the form submission
document.getElementById('score-form').addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent the default form submission behavior

  // Get user initials from the input field
  const userInitials = document.getElementById('initials').value;

  // Save user's score with initials to local storage
  saveHighScore(userInitials);

  window.location.href = 'highscores.html';
});

// Function to handle the end of the quiz
function endQuiz() {
  clearInterval(timer);
  displayFinalScore();
}

// Function to display a message for wrong answers
function wrongAnswer() {
  const wrongA = document.createElement('h3');
  wrongA.style.fontWeight = 'bold';
  wrongA.textContent = 'Incorrect answer';
  answerChoices.appendChild(wrongA);
}

// Function to display the final score
function displayFinalScore() {
    answerChoices.innerHTML = ''; // Clear answer choices
    questionElement.textContent = 'Quiz Completed!';
  
    const { score, initials } = calculateScore(); // Retrieve score and initials
    const finalScore = document.createElement('h3');
    finalScore.textContent = `Your Final Score: ${score} / ${quizData.length}`;
    answerChoices.appendChild(finalScore);
  
    // Display form for user to enter initials
    const scoreForm = document.getElementById('score-form');
    scoreForm.classList.remove('hide');
    
    // Set the final score in a data attribute for later use
    scoreForm.dataset.finalScore = JSON.stringify({ score, initials });
  }
  

// Function to calculate the score and return an object with score and initials
function calculateScore() {
  let score = 0;

  // Check each question's selected answer against the correct answer
  for (const question of quizData) {
    if (question.selectedAnswer === question.correctAnswer) {
      score++;
    }
  }

  // Get user initials from the input field
  const userInitials = document.getElementById('initials').value;

  return { score, initials: userInitials };
}


// Function to save high score to local storage
function saveHighScore(userInitials) {
    // Fetch existing high scores from local storage
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  
    // Add current user's score to high scores
    const score = calculateScore();
    highScores.push({ initials: userInitials, score });
  
    // Sort high scores in descending order
    highScores.sort((a, b) => b.score - a.score);
  
    // Save high scores back to local storage
    localStorage.setItem('highScores', JSON.stringify(highScores));
  }

  // Function to handle the end of the quiz
  function endQuiz() {
    clearInterval(timer);
    displayFinalScore();
  
    // Save the high score when the quiz ends
    saveHighScore();
  }
  
  
  // Example on highscores.html
  const scoreForm = document.getElementById('score-form');
  const finalScoreData = JSON.parse(scoreForm.dataset.finalScore);
  
  console.log(`User ${finalScoreData.initials} scored ${finalScoreData.score}`);
  
  // Fetch high scores from local storage and display them on highscores.html
  document.addEventListener('DOMContentLoaded', function () {
    const highScoresList = document.getElementById('highscores');
  
    // Fetch high scores from local storage
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  
    // Display each high score in the list
    highScores.forEach((scoreData, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `#${index + 1}: ${scoreData.initials} - ${scoreData.score}`;
      highScoresList.appendChild(listItem);
    });
  
    // Event listener to clear high scores
    const clearButton = document.getElementById('clear');
    clearButton.addEventListener('click', function () {
      // Clear high scores from local storage
      localStorage.removeItem('highScores');
  
      // Clear the displayed high scores
      highScoresList.innerHTML = '';
    });
  });
  
