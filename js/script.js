//  Declaration javascript variable 
const filterBtn = document.querySelector('.filter-submit');
const quizForm = document.querySelector('.quiz-form');
const quizResultBox = document.querySelector('.quiz-result--box');
let api;
const questionAmount = document.querySelector('.filter-number').value;
const filterCategory = document.querySelector('.filter-category').value;
const filterDifficulty = document.querySelector('.filter-difficulty').value;


// Quize API 
const loadQuiz = (api) => {
    quizForm.classList.remove('disable');
    quizResultBox.classList.remove('visible');
    // quizForm.innerHTML = '<div class="spinner"></div>';
    quizForm.innerHTML = ` <div class="spinner">
                                <img src="./img/preloader.gif" alt="">
                          </div> `;

    fetch(api)
        .then(res => res.json())
        .then(data => {
            displayQuiz(data.results);
            matchQuiz(data.results);
        })
}

filterBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (!questionAmount || questionAmount < 5) {
        displayWarning('Question amount must be a number and minimum 5');
        return
    } else if (filterCategory === 'any' && filterDifficulty === 'any') {
        api = `https://opentdb.com/api.php?amount=${questionAmount}&type=multiple`
    } else if (filterCategory === 'any') {
        api = `https://opentdb.com/api.php?amount=${questionAmount}&difficulty=${filterDifficulty}&type=multiple`
    } else if (filterDifficulty === 'any') {
        api = `https://opentdb.com/api.php?amount=${questionAmount}&category=${filterCategory}&type=multiple`
    } else {
        api = `https://opentdb.com/api.php?amount=${questionAmount}&category=${filterCategory}&difficulty=${filterDifficulty}&type=multiple`
    }

    loadQuiz(api);
})

// Show Quize In Display 

const displayQuiz = quizes => {
    const quizForm = document.querySelector('.quiz-form');
    quizForm.innerHTML = '';

    quizes.forEach((quiz, ind) => {
        ind++;
        const options = quiz.incorrect_answers;
        const random = Math.floor(Math.random() * 4);
        options.splice(random, 0, quiz.correct_answer);

        const question = `
                        <div class="question-box">

                            <p class="question-number my-primary-btn ">Question ${ind < 9 ? '0' + ind : ind}</p>
                            <h3 class="question">${quiz.question}</h3>
                            <div class="option__box">
                                <div class="option">
                                    <input type="radio" name="question${ind}" id="q${ind}o1">
                                    <label for="q${ind}o1"><span>${options[0]}</span></label>
                                </div>
                                <div class="option">
                                    <input type="radio" name="question${ind}" id="q${ind}o2">
                                    <label for="q${ind}o2"><span>${options[1]}</span></label>
                                </div>
                                <div class="option">
                                    <input type="radio" name="question${ind}" id="q${ind}o3">
                                    <label for="q${ind}o3"><span>${options[2]}</span></label>
                                </div>
                                <div class="option">
                                    <input type="radio" name="question${ind}" id="q${ind}o4">
                                    <label for="q${ind}o4"><span>${options[3]}</span></label>
                                </div>
                            </div>
                        </div>
                        `
        quizForm.insertAdjacentHTML('beforeend', question)

        options.forEach((option, optNum) => document.querySelector(`#q${ind}o${optNum + 1}`).value = options[optNum])
    })

    const submitBtn = `<div class="submit__box">
                            <input class="submit my-primary-btn" type="submit" value="Submit Answer">
                        </div>`
    quizForm.insertAdjacentHTML('beforeend', submitBtn)
}

// Quize Result And Warning

const matchQuiz = quizes => {
    const submitBtn = document.querySelector('.submit');
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        if (document.querySelectorAll('input[type="radio"]:checked').length < quizes.length) {
            displayWarning('Please select every questions answer and try to submit again');
            return
        }

        let marks = 0;
        quizes.forEach((quiz, ind) => {
            const selectedAnswer = document.querySelector(`input[name="question${ind + 1}"]:checked`);

            if (selectedAnswer.value === quiz.correct_answer) {
                marks += 1;
                selectedAnswer.classList.add('correct');
            } else {
                selectedAnswer.classList.add('wrong');

                for (let i = 1; i <= 4; i++) {
                    const option = document.getElementById(`q${ind + 1}o${i}`);
                    if (option.value === quiz.correct_answer) {
                        option.classList.add('correct');
                    }
                }
            }
        })

        const quizForm = document.querySelector('.quiz-form');
        const quizResultBox = document.querySelector('.quiz-result--box');
        const quizResult = document.querySelector('.quiz-result');

        quizResult.innerText = `${marks}/${quizes.length}`;
        quizForm.classList.add('disable');
        quizResultBox.classList.add('visible');
        window.location.hash = '';
        window.location.hash = 'quiz';
        submitBtn.style.display = 'none';
    })

    // Quize Timer     

    let startingMinute = 15;
    let time = startingMinute * 60;
    const countDown = document.getElementById("timer-sec")

    let myInterval = setInterval(updateCountDown, 1000);

    function updateCountDown() {
        const minute = Math.floor(time / 60);
        const seconds = time % 60;
        countDown.innerHTML = `${minute}:${seconds}`
        time--;

        if (time < 1) {
            console.log("your time gonna be end");
            timerDisplayWarning(`Your time gonna be End. Please Take A new Task`)
            clearInterval(myInterval);
            submitBtn.style.display = 'none';
            setTimeout(function () {
                location.reload();
            }, 3500)
        }
    }
}

// Popup Message In Warning based 

const displayWarning = message => {
    const popup = document.querySelector('.popup');
    const popupDescription = document.querySelector('.popup-description');

    popupDescription.innerText = message;
    popup.classList.add('visible')

    setTimeout(function () {
        popup.classList.remove('visible');
    }, 2500)
}

const timerDisplayWarning = message => {
    const popup = document.querySelector('.popup');
    const popupDescription = document.querySelector('.popup-description');

    popupDescription.innerText = message;
    popup.classList.add('visible')
}

