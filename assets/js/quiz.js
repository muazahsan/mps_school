/**
 * Quiz Module
 * Handles interactive multiple choice questions with scoring, feedback, and progress tracking
 */

class QuizManager {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.totalQuestions = 0;
        this.isActive = false;
        this.timeLimit = null;
        this.timer = null;
        this.timeRemaining = 0;
        
        // Options
        this.options = {
            showFeedback: true,
            randomizeQuestions: true,
            allowRetry: true,
            timeLimit: null, // in seconds
            passingScore: 70, // percentage
            ...options
        };
        
        // Callbacks
        this.onQuestionChange = null;
        this.onQuizComplete = null;
        this.onScoreUpdate = null;
        
        this.init();
    }

    /**
     * Initialize quiz manager
     */
    init() {
        if (!this.container) {
            console.error('Quiz container not found');
            return;
        }

        this.createQuizInterface();
        console.log('Quiz Manager initialized');
    }

    /**
     * Create quiz interface
     */
    createQuizInterface() {
        this.container.innerHTML = `
            <div class="quiz-header">
                <div class="quiz-progress">
                    <span class="question-counter">Question <span id="currentQuestion">1</span> of <span id="totalQuestions">0</span></span>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                </div>
                <div class="quiz-timer" id="quizTimer" style="display: none;">
                    <span class="timer-icon">⏱️</span>
                    <span class="timer-text" id="timerText">00:00</span>
                </div>
            </div>
            
            <div class="quiz-content">
                <div class="question-container" id="questionContainer">
                    <h3 class="question-text" id="questionText"></h3>
                    <div class="options-container" id="optionsContainer"></div>
                </div>
                
                <div class="feedback-container" id="feedbackContainer" style="display: none;">
                    <div class="feedback-message" id="feedbackMessage"></div>
                    <div class="correct-answer" id="correctAnswer" style="display: none;"></div>
                    <div class="explanation" id="explanation" style="display: none;"></div>
                </div>
            </div>
            
            <div class="quiz-controls">
                <button class="btn btn-secondary" id="prevBtn" style="display: none;">Previous</button>
                <button class="btn btn-primary" id="nextBtn">Next</button>
                <button class="btn btn-success" id="submitBtn" style="display: none;">Submit Quiz</button>
                <button class="btn btn-warning" id="retryBtn" style="display: none;">Retry Quiz</button>
            </div>
            
            <div class="quiz-results" id="quizResults" style="display: none;">
                <h2 class="results-title">Quiz Results</h2>
                <div class="score-display">
                    <div class="score-circle">
                        <span class="score-number" id="scoreNumber">0</span>
                        <span class="score-percent">%</span>
                    </div>
                    <div class="score-text" id="scoreText"></div>
                </div>
                <div class="results-summary" id="resultsSummary"></div>
                <div class="results-actions">
                    <button class="btn btn-primary" id="reviewBtn">Review Answers</button>
                    <button class="btn btn-secondary" id="retryResultsBtn">Try Again</button>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Navigation buttons
        document.getElementById('prevBtn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('submitBtn').addEventListener('click', () => this.submitQuiz());
        document.getElementById('retryBtn').addEventListener('click', () => this.retryQuiz());
        
        // Results buttons
        document.getElementById('reviewBtn').addEventListener('click', () => this.reviewAnswers());
        document.getElementById('retryResultsBtn').addEventListener('click', () => this.retryQuiz());
    }

    /**
     * Load questions
     */
    loadQuestions(questions) {
        this.questions = questions;
        this.totalQuestions = questions.length;
        
        // Randomize questions if enabled
        if (this.options.randomizeQuestions) {
            this.shuffleQuestions();
        }
        
        // Update display
        document.getElementById('totalQuestions').textContent = this.totalQuestions;
        
        console.log(`Loaded ${this.totalQuestions} questions`);
    }

    /**
     * Shuffle questions
     */
    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
    }

    /**
     * Start quiz
     */
    startQuiz() {
        this.isActive = true;
        this.currentQuestionIndex = 0;
        this.score = 0;
        
        // Reset UI
        this.showQuestionContainer();
        this.hideResults();
        
        // Start timer if time limit is set
        if (this.options.timeLimit) {
            this.startTimer();
        }
        
        // Show first question
        this.showQuestion();
        
        console.log('Quiz started');
    }

    /**
     * Show question
     */
    showQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.completeQuiz();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        
        // Update question counter
        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;
        
        // Update progress bar
        const progress = ((this.currentQuestionIndex + 1) / this.totalQuestions) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        
        // Display question
        document.getElementById('questionText').textContent = question.text;
        
        // Display options
        this.displayOptions(question.options);
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Hide feedback
        this.hideFeedback();
        
        // Trigger callback
        if (this.onQuestionChange) {
            this.onQuestionChange(this.currentQuestionIndex, question);
        }
    }

    /**
     * Display options
     */
    displayOptions(options) {
        const container = document.getElementById('optionsContainer');
        container.innerHTML = '';
        
        options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.innerHTML = `
                <input type="radio" name="question" id="option${index}" value="${index}">
                <label for="option${index}">${option}</label>
            `;
            
            // Add click event
            optionDiv.addEventListener('click', () => this.selectOption(index));
            
            container.appendChild(optionDiv);
        });
    }

    /**
     * Select option
     */
    selectOption(optionIndex) {
        // Uncheck all options
        document.querySelectorAll('input[name="question"]').forEach(input => {
            input.checked = false;
        });
        
        // Check selected option
        document.getElementById(`option${optionIndex}`).checked = true;
        
        // Store answer
        this.questions[this.currentQuestionIndex].selectedAnswer = optionIndex;
        
        // Show feedback if enabled
        if (this.options.showFeedback) {
            this.showFeedback();
        }
    }

    /**
     * Show feedback
     */
    showFeedback() {
        const question = this.questions[this.currentQuestionIndex];
        const feedbackContainer = document.getElementById('feedbackContainer');
        const feedbackMessage = document.getElementById('feedbackMessage');
        const correctAnswer = document.getElementById('correctAnswer');
        const explanation = document.getElementById('explanation');
        
        if (question.selectedAnswer === question.correctAnswer) {
            feedbackMessage.textContent = 'Correct!';
            feedbackMessage.className = 'feedback-message correct';
            this.score++;
        } else {
            feedbackMessage.textContent = 'Incorrect!';
            feedbackMessage.className = 'feedback-message incorrect';
        }
        
        // Show correct answer if wrong
        if (question.selectedAnswer !== question.correctAnswer) {
            correctAnswer.textContent = `Correct answer: ${question.options[question.correctAnswer]}`;
            correctAnswer.style.display = 'block';
        } else {
            correctAnswer.style.display = 'none';
        }
        
        // Show explanation if available
        if (question.explanation) {
            explanation.textContent = question.explanation;
            explanation.style.display = 'block';
        } else {
            explanation.style.display = 'none';
        }
        
        feedbackContainer.style.display = 'block';
        
        // Update score callback
        if (this.onScoreUpdate) {
            this.onScoreUpdate(this.score, this.currentQuestionIndex + 1);
        }
    }

    /**
     * Hide feedback
     */
    hideFeedback() {
        document.getElementById('feedbackContainer').style.display = 'none';
    }

    /**
     * Next question
     */
    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.showQuestion();
        } else {
            this.completeQuiz();
        }
    }

    /**
     * Previous question
     */
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.showQuestion();
        }
    }

    /**
     * Update navigation buttons
     */
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        // Show/hide previous button
        prevBtn.style.display = this.currentQuestionIndex > 0 ? 'block' : 'none';
        
        // Show/hide next/submit button
        if (this.currentQuestionIndex === this.questions.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }

    /**
     * Submit quiz
     */
    submitQuiz() {
        // Check if all questions are answered
        const unanswered = this.questions.filter(q => q.selectedAnswer === undefined);
        
        if (unanswered.length > 0) {
            this.showMessage(`You have ${unanswered.length} unanswered question(s). Please answer all questions.`, 'warning');
            return;
        }
        
        this.completeQuiz();
    }

    /**
     * Complete quiz
     */
    completeQuiz() {
        this.isActive = false;
        this.stopTimer();
        
        // Calculate final score
        const percentage = Math.round((this.score / this.totalQuestions) * 100);
        
        // Show results
        this.showResults(percentage);
        
        // Trigger callback
        if (this.onQuizComplete) {
            this.onQuizComplete(percentage, this.score, this.totalQuestions);
        }
        
        console.log(`Quiz completed. Score: ${this.score}/${this.totalQuestions} (${percentage}%)`);
    }

    /**
     * Show results
     */
    showResults(percentage) {
        this.hideQuestionContainer();
        
        const resultsContainer = document.getElementById('quizResults');
        const scoreNumber = document.getElementById('scoreNumber');
        const scoreText = document.getElementById('scoreText');
        const resultsSummary = document.getElementById('resultsSummary');
        
        // Update score display
        scoreNumber.textContent = percentage;
        
        // Set score text and color
        if (percentage >= this.options.passingScore) {
            scoreText.textContent = 'Passed!';
            scoreText.className = 'score-text passed';
        } else {
            scoreText.textContent = 'Failed';
            scoreText.className = 'score-text failed';
        }
        
        // Create summary
        const summary = `
            <div class="summary-item">
                <span class="summary-label">Correct Answers:</span>
                <span class="summary-value">${this.score} / ${this.totalQuestions}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Accuracy:</span>
                <span class="summary-value">${percentage}%</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Passing Score:</span>
                <span class="summary-value">${this.options.passingScore}%</span>
            </div>
        `;
        
        resultsSummary.innerHTML = summary;
        
        resultsContainer.style.display = 'block';
    }

    /**
     * Hide question container
     */
    hideQuestionContainer() {
        document.querySelector('.quiz-content').style.display = 'none';
        document.querySelector('.quiz-controls').style.display = 'none';
    }

    /**
     * Show question container
     */
    showQuestionContainer() {
        document.querySelector('.quiz-content').style.display = 'block';
        document.querySelector('.quiz-controls').style.display = 'flex';
    }

    /**
     * Hide results
     */
    hideResults() {
        document.getElementById('quizResults').style.display = 'none';
    }

    /**
     * Retry quiz
     */
    retryQuiz() {
        if (!this.options.allowRetry) {
            this.showMessage('Retry is not allowed for this quiz.', 'error');
            return;
        }
        
        // Reset quiz state
        this.questions.forEach(q => {
            q.selectedAnswer = undefined;
        });
        
        // Restart quiz
        this.startQuiz();
    }

    /**
     * Review answers
     */
    reviewAnswers() {
        this.currentQuestionIndex = 0;
        this.showQuestionContainer();
        this.hideResults();
        this.showQuestion();
        
        // Disable option selection during review
        document.querySelectorAll('.option').forEach(option => {
            option.style.pointerEvents = 'none';
        });
    }

    /**
     * Start timer
     */
    startTimer() {
        this.timeRemaining = this.options.timeLimit;
        document.getElementById('quizTimer').style.display = 'block';
        
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimer();
            
            if (this.timeRemaining <= 0) {
                this.completeQuiz();
            }
        }, 1000);
        
        this.updateTimer();
    }

    /**
     * Stop timer
     */
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    /**
     * Update timer display
     */
    updateTimer() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('timerText').textContent = timeString;
        
        // Add warning class when time is running low
        const timerElement = document.getElementById('quizTimer');
        if (this.timeRemaining <= 30) {
            timerElement.classList.add('warning');
        } else {
            timerElement.classList.remove('warning');
        }
    }

    /**
     * Show message
     */
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `quiz-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 15px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        // Set background color based on type
        const colors = {
            success: '#4CAF50',
            error: '#F44336',
            warning: '#FF9800',
            info: '#2196F3'
        };
        messageDiv.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(messageDiv);

        // Remove after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    /**
     * Get quiz results
     */
    getResults() {
        return {
            score: this.score,
            totalQuestions: this.totalQuestions,
            percentage: Math.round((this.score / this.totalQuestions) * 100),
            passed: this.score >= (this.totalQuestions * this.options.passingScore / 100),
            timeSpent: this.options.timeLimit ? this.options.timeLimit - this.timeRemaining : null
        };
    }

    /**
     * Set callbacks
     */
    setCallbacks(callbacks) {
        if (callbacks.onQuestionChange) this.onQuestionChange = callbacks.onQuestionChange;
        if (callbacks.onQuizComplete) this.onQuizComplete = callbacks.onQuizComplete;
        if (callbacks.onScoreUpdate) this.onScoreUpdate = callbacks.onScoreUpdate;
    }

    /**
     * Destroy quiz
     */
    destroy() {
        this.stopTimer();
        this.container.innerHTML = '';
    }
}

// Initialize quiz manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Auto-initialize if quiz container exists
    const quizContainer = document.querySelector('[data-quiz]');
    if (quizContainer) {
        window.QuizManager = new QuizManager(quizContainer.id);
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuizManager;
} 