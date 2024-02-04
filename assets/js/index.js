import { defaultLanguage, qnaList, resultList } from "./data.js";

const LANGUAGE_SCORE_MAP = {
    "Java": 0,
    "Javascript": 0,
    "Python": 0,
    "Kotlin": 0,
    "Swift": 0,
    "C++": 0,
    "SQL": 0
}

function clickStartButton() {
    const startContainer = document.querySelector('#start')
    const questionContainer = document.querySelector('#question')

    if (!startContainer) {
        console.error('Start Container is not exist')
        return
    }

    if (!questionContainer) {
        console.error('Question Container is not exist')
        return
    }

    startContainer.style.display = 'none'
    questionContainer.style.display = 'flex'

    const questionItemArr = questionContainer.querySelectorAll('.question-box .question-item')

    if (!questionItemArr || questionItemArr.length === 0) {
        console.error('Question Item Generate Error might occured error')
        return
    }

    questionItemArr.forEach((questionItem) => {
        if (questionItem.dataset.index === '0') {
            return
        }

        questionItem.style.display = 'none'
    })
}

function initStartButton() {
    const startButtonEl = document.querySelector('.start-button')

    startButtonEl.addEventListener('click', () => {
        clickStartButton()
    }, { passive: true })
}

function applyAnswer(currentQuestion, clickedAnswer) {
    if (!currentQuestion || !clickedAnswer || Number(currentQuestion) === 'NaN' || Number(clickedAnswer) === 'NaN') {
        console.error('Current Question or Answer is Abnormal')
        return
    }

    const targetAnswerData = qnaList[currentQuestion].a
    const targetLanguageType = targetAnswerData[clickedAnswer].type

    const langueScoreMapKeys = Object.keys(LANGUAGE_SCORE_MAP)

    if (targetLanguageType && targetLanguageType.length > 0) {
        targetLanguageType.forEach((language) => {
            if (langueScoreMapKeys.includes(language)) {
                LANGUAGE_SCORE_MAP[language]++
            }
        })
    }
}

function initResult() {
    const questionContainer = document.querySelector('#question')
    const resultContainer = document.querySelector('#result')

    if (!questionContainer) {
        console.error('Question Container is not exist')
        return
    }

    if (!resultContainer) {
        console.error('Result Container is not exist')
        return
    }

    questionContainer.style.display = 'none'
    resultContainer.style.display = 'flex'

    const languageScoreMapArr = Object.keys(LANGUAGE_SCORE_MAP).map(function (key) { 
        return LANGUAGE_SCORE_MAP[key]
    })

    const topScoreLanguage = Object.keys(LANGUAGE_SCORE_MAP).reduce((a, b) => LANGUAGE_SCORE_MAP[a] > LANGUAGE_SCORE_MAP[b] ? a : b);

    if (!topScoreLanguage) {
        alert('데이터에 에러가 발생했네요. 불편을 끼쳐 드려 죄송해요')
        return
    }

    const topScoreLanguageInfo = resultList[topScoreLanguage]    
    if (!topScoreLanguageInfo.name || !topScoreLanguageInfo.desc) {
        alert('데이터에 에러가 발생했네요. 불편을 끼쳐 드려 죄송해요')
        return
    }

    const resultContainerEl = document.querySelector('#result')

    if (!resultContainerEl) {
        console.error('Result Container is not exist')
        return
    }
    
    const resultSummaryEl = resultContainerEl.querySelector('.result-summary')
    const resultTitleEl = resultContainerEl.querySelector('.result-title')

    if (resultSummaryEl && resultTitleEl) {
        resultSummaryEl.textContent = topScoreLanguageInfo.name
        resultTitleEl.textContent = topScoreLanguageInfo.desc
    }
}

function clickAnswerButton(event) {
    const currentButtonEl = event.target
    if (!currentButtonEl) {
        console.error('Current Button is Abnormal')
        return
    }

    const clickedAnswer = currentButtonEl.dataset.answerIndex
    if (!clickedAnswer) {
        console.error('Answer is not defined')
        return
    }

    const currentQuestionEl = currentButtonEl.closest('.question-item')

    const currentQuestion = currentQuestionEl.dataset.index

    applyAnswer(currentQuestion, clickedAnswer)

    const isQuestionEnd = Number(currentQuestion) === qnaList.length - 1
    if (isQuestionEnd) {
        initResult()
    } else {
        const nextQuestionEl = document.querySelector(`.question-item[data-index="${Number(currentQuestion) + 1}"`)

        if (!nextQuestionEl) {
            console.error('Next Question is not exist')
            return
        }

        currentQuestionEl.style.display = 'none'
        nextQuestionEl.style.display = 'flex'
    }
}

function initQuestion() {
    const questionContainer = document.querySelector('.question-box')
    
    if (!questionContainer) {
        console.error('Question Container is not exist')
        return
    }

    qnaList.forEach((qnaItem, index) => {        
        const question = qnaItem.q
        const answers = qnaItem.a

        if (!question || !answers || typeof answers !== 'object') {
            console.error('Question Data is abnormal')
            return
        }

        // 질문과 대답을 감싸는 질문별 컨테이너 생성
        const questionItemWrapper = document.createElement('div')
        questionItemWrapper.classList.add('question-item')
        questionItemWrapper.dataset.index = index

        // 질문 컨테이너 생성
        const questionWrapper = document.createElement('div')
        questionWrapper.classList.add('question')

        // 질문 컨테이너에 qnaList의 질문 대입
        questionWrapper.textContent = question
        
        // 두 개의 대답을 감싸는 대답 컨테이너 생성
        const answersWrapper = document.createElement('div')
        answersWrapper.classList.add('answer-wrapper')

        answers.forEach((answerData, answerIndex) => {            
            const answerItemButton = document.createElement('button')
            answerItemButton.textContent = answerData.answer
            answerItemButton.dataset.answerIndex = answerIndex
            answerItemButton.classList.add('answer-button')
            
            answerItemButton.addEventListener('click', (event) => {
                clickAnswerButton(event)
            }, { passive: true })

            answersWrapper.appendChild(answerItemButton)
        })

        questionItemWrapper.appendChild(questionWrapper)
        questionItemWrapper.appendChild(answersWrapper)

        questionContainer.appendChild(questionItemWrapper)
    })
}

document.addEventListener('DOMContentLoaded', () => {
    initStartButton()
    initQuestion()
})
