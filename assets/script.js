const stopWatch = document.getElementById('time');
const questionElement = document.querySelector('#question-title');
const answerChoices = document.querySelector('#choices');
const startButton = document.getElementById('start');
const nextQuestionButton = document.querySelector('.next-question');


let quizData = [];
let questionIndex = 0;
let timer;
let clock = 30;
stopWatch.textContent = 30
nextQuestionButton.style.display = `none`


function displayQuestion(array, index) {
  questionElement.textContent = array[index].question;

  
  array[index].answers.forEach((value) => {
    const answerOption = document.createElement('button');
    answerOption.textContent = value;
    answerChoices.appendChild(answerOption);
  });
}


function nextQuestion() {
  answerChoices.innerHTML = ''; 
}


startButton.addEventListener('click', function () {
  
  document.getElementById('start-screen').classList.add('hide');
  
  
  document.getElementById('questions').classList.remove('hide');

 
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

  
  displayQuestion(quizData, questionIndex);

  
  timer = setInterval(() => {
    stopWatch.textContent = clock;
    clock--;

    
    if (clock < 0 || questionIndex >= quizData.length) {
      clearInterval(timer);
      stopWatch.textContent = 'Time is up!';
      endQuiz();
    }
  }, 1000);
});


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
  

  function displayFeedback(message) {
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = message;
  
    
    setTimeout(() => {
      feedbackElement.textContent = '';
    }, 2000); 
  }
  
  
  

document.getElementById('score-form').addEventListener('submit', (e) => {
  e.preventDefault(); 

  
  const userInitials = document.getElementById('initials').value;

  
  saveHighScore(userInitials);

  window.location.href = 'highscores.html';
});


function endQuiz() {
  clearInterval(timer);
  displayFinalScore();
}


function wrongAnswer() {
  const wrongA = document.createElement('h3');
  wrongA.style.fontWeight = 'bold';
  wrongA.textContent = 'Incorrect answer';
  answerChoices.appendChild(wrongA);
}


function displayFinalScore() {
    answerChoices.innerHTML = ''; 
    questionElement.textContent = 'Quiz Completed!';
  
    const { score, initials } = calculateScore(); 
    const finalScore = document.createElement('h3');
    finalScore.textContent = `Your Final Score: ${score} / ${quizData.length}`;
    answerChoices.appendChild(finalScore);
  
    
    const scoreForm = document.getElementById('score-form');
    scoreForm.classList.remove('hide');
    
   
    scoreForm.dataset.finalScore = JSON.stringify({ score, initials });
  }
  


function calculateScore() {
  let score = 0;

  
  for (const question of quizData) {
    if (question.selectedAnswer === question.correctAnswer) {
      score++;
    }
  }


  const userInitials = document.getElementById('initials').value;

  return { score, initials: userInitials };
}



// form submission
document.getElementById('score-form').addEventListener('submit', (e) => {
    e.preventDefault(); 
  // This prevents the normal behaviour of the form. This is very important tool to add to your toolbox
    
    const userInitials = document.getElementById('initials').value;
  
    saveHighScore(userInitials);
  
    // Redirects page to highscores.html
    window.location.href = 'highscores.html';
  });
  
  function endQuiz() {
    clearInterval(timer);
    displayFinalScore();
  }
  
  //  Final score
  function displayFinalScore() {
    answerChoices.innerHTML = ''; 
    questionElement.textContent = 'Quiz Completed!';
  
    const { score } = calculateScore(); 
    const finalScore = document.createElement('h3');
    finalScore.textContent = `Your Final Score: ${score} / ${quizData.length}`;
    answerChoices.appendChild(finalScore);
  

    const scoreForm = document.getElementById('score-form');
    scoreForm.classList.remove('hide');
  
    scoreForm.dataset.finalScore = JSON.stringify({ score });
  }
  
  // save high score to local storage
  function saveHighScore(userInitials) {
    
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  
    
    const finalScoreData = JSON.parse(document.getElementById('score-form').dataset.finalScore);
  
   
    highScores.push({ initials: userInitials, score: finalScoreData.score });
  
   
    highScores.sort((a, b) => b.score - a.score);
  
    
    localStorage.setItem('highScores', JSON.stringify(highScores));
  }
  
  // highscores.html JavaScript

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

   // Event listener for clear highscores button
    const clearButton = document.getElementById('clear');
    clearButton.addEventListener('click', function () {
        
        localStorage.removeItem('highScores');

        
        highScoresList.innerHTML = '';
    });
});
  
function endQuiz() {
    clearInterval(timer);
    displayFinalScore();
  }
  
  
  function displayFinalScore() {
    answerChoices.innerHTML = ''; 
    questionElement.textContent = 'Quiz Completed!';
  
    const { score } = calculateScore(); 
    const finalScore = document.createElement('h3');
    finalScore.textContent = `Your Final Score: ${score} / ${quizData.length}`;
    answerChoices.appendChild(finalScore);
  
    // creating the form for user input with added validation incase they don't type their initials
    const scoreForm = document.createElement('form');
    scoreForm.id = 'score-form';
    const initialsInput = document.createElement('input');
    initialsInput.type = 'text';
    initialsInput.id = 'initials';
    initialsInput.placeholder = 'Enter your initials';
    initialsInput.setAttribute('required', true);
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Save Score';
    scoreForm.appendChild(initialsInput);
    scoreForm.appendChild(submitButton);
    answerChoices.appendChild(scoreForm);
  }