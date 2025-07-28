/**
 * Language Management Module
 * Handles multi-language support with translations for English, Tamil, and Urdu
 */

class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.loadedLanguages = new Set();
        this.fallbackLanguage = 'en';
        
        // Translation data
        this.translationData = {
            en: {
                ui: {
                    home: "Home",
                    back: "Back",
                    next: "Next",
                    previous: "Previous",
                    close: "Close",
                    save: "Save",
                    cancel: "Cancel",
                    loading: "Loading...",
                    error: "Error",
                    success: "Success",
                    settings: "Settings",
                    about: "About",
                    navigation: "Navigation",
                    allStandards: "All Standards",
                    enterClass: "Enter Class",
                    enterSubject: "Enter Subject",
                    subjects: "Subjects",
                    lessons: "Lessons",
                    progress: "Progress",
                    completed: "Completed",
                    inProgress: "In Progress",
                    notStarted: "Not Started",
                    addNewLesson: "Add New Lesson",
                    startLesson: "Start Lesson",
                    continueLesson: "Continue Lesson",
                    finishLesson: "Finish Lesson",
                    takeQuiz: "Take Quiz",
                    drawing: "Drawing",
                    clear: "Clear",
                    save: "Save Drawing",
                    load: "Load Drawing",
                    pen: "Pen",
                    eraser: "Eraser",
                    color: "Color",
                    size: "Size",
                    small: "Small",
                    medium: "Medium",
                    large: "Large",
                    submit: "Submit",
                    retry: "Retry",
                    score: "Score",
                    correct: "Correct",
                    incorrect: "Incorrect",
                    congratulations: "Congratulations!",
                    wellDone: "Well done!",
                    tryAgain: "Try again",
                    offline: "Offline",
                    online: "Online",
                    sync: "Sync",
                    language: "Language",
                    viewMode: "View Mode",
                    grid: "Grid",
                    list: "List",
                    sound: "Sound",
                    animations: "Animations",
                    accessibility: "Accessibility",
                    highContrast: "High Contrast",
                    largeText: "Large Text",
                    reducedMotion: "Reduced Motion"
                },
                subjects: {
                    tamil: "Tamil",
                    urdu: "Urdu",
                    maths: "Mathematics",
                    english: "English",
                    science: "Science",
                    social: "Social Studies",
                    tamilDescription: "Learn Tamil language and literature",
                    urduDescription: "Learn Urdu language and script",
                    mathsDescription: "Learn numbers, counting, and basic math",
                    englishDescription: "Learn English language and communication",
                    scienceDescription: "Explore the world around us",
                    socialDescription: "Learn about society and culture"
                },
                standards: {
                    standard1: "Standard 1",
                    standard2: "Standard 2",
                    standard3: "Standard 3",
                    standard4: "Standard 4",
                    standard5: "Standard 5",
                    standard6: "Standard 6",
                    standard1Subtitle: "Beginner Level",
                    standard2Subtitle: "Elementary Level",
                    standard3Subtitle: "Intermediate Level",
                    standard4Subtitle: "Advanced Level",
                    standard5Subtitle: "Higher Level",
                    standard6Subtitle: "Final Level"
                },
                lessons: {
                    title: "Lesson {number}",
                    introduction: "Introduction",
                    content: "Content",
                    summary: "Summary",
                    quiz: "Quiz",
                    drawing: "Drawing Activity",
                    progress: "Progress",
                    timeRemaining: "Time Remaining",
                    questionsRemaining: "Questions Remaining",
                    totalQuestions: "Total Questions",
                    correctAnswers: "Correct Answers",
                    percentage: "Percentage"
                },
                messages: {
                    schoolName: "Primary School Learning App",
                    welcomeTitle: "Welcome to Your Learning Journey!",
                    welcomeText: "Choose your standard to start learning with fun and interactive lessons.",
                    schoolName: "Primary School Learning App",
                    lessonCompleted: "Lesson completed successfully!",
                    quizCompleted: "Quiz completed!",
                    drawingSaved: "Drawing saved successfully!",
                    progressSaved: "Progress saved!",
                    offlineMode: "You are currently offline. Some features may be limited.",
                    syncComplete: "Data synchronized successfully!",
                    errorLoading: "Error loading content. Please try again.",
                    networkError: "Network error. Please check your connection.",
                    unsavedChanges: "You have unsaved changes. Are you sure you want to leave?",
                    confirmDelete: "Are you sure you want to delete this item?",
                    confirmReset: "Are you sure you want to reset your progress?"
                }
            },
            ta: {
                ui: {
                    home: "முகப்பு",
                    back: "பின்",
                    next: "அடுத்து",
                    previous: "முந்தைய",
                    close: "மூடு",
                    save: "சேமி",
                    cancel: "ரத்து",
                    loading: "ஏற்றுகிறது...",
                    error: "பிழை",
                    success: "வெற்றி",
                    settings: "அமைப்புகள்",
                    about: "பற்றி",
                    navigation: "வழிசெலுத்தல்",
                    allStandards: "அனைத்து தரங்களும்",
                    enterClass: "வகுப்பில் நுழைக",
                    enterSubject: "பாடத்தில் நுழைக",
                    subjects: "பாடங்கள்",
                    lessons: "பாடங்கள்",
                    progress: "முன்னேற்றம்",
                    completed: "முடிந்தது",
                    inProgress: "நடைபெறுகிறது",
                    notStarted: "தொடங்கப்படவில்லை",
                    addNewLesson: "புதிய பாடத்தை சேர்க்கவும்",
                    startLesson: "பாடத்தைத் தொடங்கவும்",
                    continueLesson: "பாடத்தைத் தொடரவும்",
                    finishLesson: "பாடத்தை முடிக்கவும்",
                    takeQuiz: "வினாடி வினா எடுக்கவும்",
                    drawing: "வரைதல்",
                    clear: "அழி",
                    save: "வரைதலை சேமிக்கவும்",
                    load: "வரைதலை ஏற்றவும்",
                    pen: "பேனா",
                    eraser: "அழிப்பான்",
                    color: "நிறம்",
                    size: "அளவு",
                    small: "சிறிய",
                    medium: "நடுத்தர",
                    large: "பெரிய",
                    submit: "சமர்ப்பிக்கவும்",
                    retry: "மீண்டும் முயற்சிக்கவும்",
                    score: "மதிப்பெண்",
                    correct: "சரி",
                    incorrect: "தவறு",
                    congratulations: "வாழ்த்துக்கள்!",
                    wellDone: "நன்றாக செய்துள்ளீர்கள்!",
                    tryAgain: "மீண்டும் முயற்சிக்கவும்",
                    offline: "ஆஃப்லைன்",
                    online: "ஆன்லைன்",
                    sync: "ஒத்திசைவு",
                    language: "மொழி",
                    viewMode: "காட்சி பயன்முறை",
                    grid: "கட்டம்",
                    list: "பட்டியல்",
                    sound: "ஒலி",
                    animations: "அனிமேஷன்கள்",
                    accessibility: "அணுகல்",
                    highContrast: "உயர் க contrast",
                    largeText: "பெரிய உரை",
                    reducedMotion: "குறைக்கப்பட்ட இயக்கம்"
                },
                subjects: {
                    tamil: "தமிழ்",
                    urdu: "உருது",
                    maths: "கணிதம்",
                    english: "ஆங்கிலம்",
                    science: "அறிவியல்",
                    social: "சமூக அறிவியல்",
                    tamilDescription: "தமிழ் மொழி மற்றும் இலக்கியம் கற்றுக்கொள்ளுங்கள்",
                    urduDescription: "உருது மொழி மற்றும் எழுத்துமுறை கற்றுக்கொள்ளுங்கள்",
                    mathsDescription: "எண்கள், எண்ணுதல் மற்றும் அடிப்படை கணிதம் கற்றுக்கொள்ளுங்கள்",
                    englishDescription: "ஆங்கில மொழி மற்றும் தொடர்பு கற்றுக்கொள்ளுங்கள்",
                    scienceDescription: "நம்மைச் சுற்றியுள்ள உலகை ஆராயுங்கள்",
                    socialDescription: "சமூகம் மற்றும் கலாச்சாரத்தைப் பற்றி கற்றுக்கொள்ளுங்கள்"
                },
                standards: {
                    standard1: "தரம் 1",
                    standard2: "தரம் 2",
                    standard3: "தரம் 3",
                    standard4: "தரம் 4",
                    standard5: "தரம் 5",
                    standard6: "தரம் 6",
                    standard1Subtitle: "ஆரம்ப நிலை",
                    standard2Subtitle: "அடிப்படை நிலை",
                    standard3Subtitle: "நடுத்தர நிலை",
                    standard4Subtitle: "மேம்பட்ட நிலை",
                    standard5Subtitle: "உயர் நிலை",
                    standard6Subtitle: "இறுதி நிலை"
                },
                lessons: {
                    title: "பாடம் {number}",
                    introduction: "அறிமுகம்",
                    content: "உள்ளடக்கம்",
                    summary: "சுருக்கம்",
                    quiz: "வினாடி வினா",
                    drawing: "வரைதல் செயல்பாடு",
                    progress: "முன்னேற்றம்",
                    timeRemaining: "மீதமுள்ள நேரம்",
                    questionsRemaining: "மீதமுள்ள கேள்விகள்",
                    totalQuestions: "மொத்த கேள்விகள்",
                    correctAnswers: "சரியான பதில்கள்",
                    percentage: "சதவீதம்"
                },
                messages: {
                    welcomeTitle: "உங்கள் கற்றல் பயணத்திற்கு வரவேற்கிறோம்!",
                    welcomeText: "வேடிக்கையான மற்றும் ஊடாடும் பாடங்களுடன் கற்றலைத் தொடங்க உங்கள் தரத்தைத் தேர்ந்தெடுக்கவும்.",
                    schoolName: "தொடக்கப்பள்ளி கற்றல் பயன்பாடு",
                    lessonCompleted: "பாடம் வெற்றிகரமாக முடிந்தது!",
                    quizCompleted: "வினாடி வினா முடிந்தது!",
                    drawingSaved: "வரைதல் வெற்றிகரமாக சேமிக்கப்பட்டது!",
                    progressSaved: "முன்னேற்றம் சேமிக்கப்பட்டது!",
                    offlineMode: "நீங்கள் தற்போது ஆஃப்லைனில் உள்ளீர்கள். சில அம்சங்கள் கட்டுப்படுத்தப்படலாம்.",
                    syncComplete: "தரவு வெற்றிகரமாக ஒத்திசைக்கப்பட்டது!",
                    errorLoading: "உள்ளடக்கத்தை ஏற்றுவதில் பிழை. மீண்டும் முயற்சிக்கவும்.",
                    networkError: "பிணைய பிழை. உங்கள் இணைப்பைச் சரிபார்க்கவும்.",
                    unsavedChanges: "நீங்கள் சேமிக்கப்படாத மாற்றங்களைக் கொண்டுள்ளீர்கள். நீங்கள் வெளியேற விரும்புகிறீர்களா?",
                    confirmDelete: "இந்த உருப்படியை நீக்க விரும்புகிறீர்களா?",
                    confirmReset: "உங்கள் முன்னேற்றத்தை மீட்டமைக்க விரும்புகிறீர்களா?"
                }
            },
            ur: {
                ui: {
                    home: "گھر",
                    back: "واپس",
                    next: "اگلا",
                    previous: "پچھلا",
                    close: "بند کریں",
                    save: "محفوظ کریں",
                    cancel: "منسوخ کریں",
                    loading: "لوڈ ہو رہا ہے...",
                    error: "غلطی",
                    success: "کامیابی",
                    settings: "ترتیبات",
                    about: "کے بارے میں",
                    navigation: "نیویگیشن",
                    allStandards: "تمام معیارات",
                    enterClass: "کلاس میں داخل ہوں",
                    enterSubject: "مضمون میں داخل ہوں",
                    subjects: "مضامین",
                    lessons: "سبق",
                    progress: "ترقی",
                    completed: "مکمل",
                    inProgress: "جاری",
                    notStarted: "شروع نہیں ہوا",
                    addNewLesson: "نیا سبق شامل کریں",
                    startLesson: "سبق شروع کریں",
                    continueLesson: "سبق جاری رکھیں",
                    finishLesson: "سبق ختم کریں",
                    takeQuiz: "کوئز لیں",
                    drawing: "ڈرائنگ",
                    clear: "صاف کریں",
                    save: "ڈرائنگ محفوظ کریں",
                    load: "ڈرائنگ لوڈ کریں",
                    pen: "قلم",
                    eraser: "ربر",
                    color: "رنگ",
                    size: "سائز",
                    small: "چھوٹا",
                    medium: "درمیانہ",
                    large: "بڑا",
                    submit: "جمع کریں",
                    retry: "دوبارہ کوشش کریں",
                    score: "اسکور",
                    correct: "درست",
                    incorrect: "غلط",
                    congratulations: "مبارک ہو!",
                    wellDone: "بہت اچھا!",
                    tryAgain: "دوبارہ کوشش کریں",
                    offline: "آف لائن",
                    online: "آن لائن",
                    sync: "سینک",
                    language: "زبان",
                    viewMode: "ویو موڈ",
                    grid: "گریڈ",
                    list: "فہرست",
                    sound: "آواز",
                    animations: "اینیمیشنز",
                    accessibility: "رسائی",
                    highContrast: "ہائی کنٹراسٹ",
                    largeText: "بڑا ٹیکسٹ",
                    reducedMotion: "کم حرکت"
                },
                subjects: {
                    tamil: "تامل",
                    urdu: "اردو",
                    maths: "ریاضی",
                    english: "انگریزی",
                    science: "سائنس",
                    social: "سماجی علوم",
                    tamilDescription: "تامل زبان اور ادب سیکھیں",
                    urduDescription: "اردو زبان اور رسم الخط سیکھیں",
                    mathsDescription: "نمبرز، گنتی اور بنیادی ریاضی سیکھیں",
                    englishDescription: "انگریزی زبان اور رابطہ سیکھیں",
                    scienceDescription: "اپنے ارد گرد کی دنیا کا مطالعہ کریں",
                    socialDescription: "معاشرہ اور ثقافت کے بارے میں سیکھیں"
                },
                standards: {
                    standard1: "معیار 1",
                    standard2: "معیار 2",
                    standard3: "معیار 3",
                    standard4: "معیار 4",
                    standard5: "معیار 5",
                    standard6: "معیار 6",
                    standard1Subtitle: "ابتدائی سطح",
                    standard2Subtitle: "بنیادی سطح",
                    standard3Subtitle: "درمیانی سطح",
                    standard4Subtitle: "اعلی سطح",
                    standard5Subtitle: "اعلی سطح",
                    standard6Subtitle: "حتمی سطح"
                },
                lessons: {
                    title: "سبق {number}",
                    introduction: "تعارف",
                    content: "مواد",
                    summary: "خلاصہ",
                    quiz: "کوئز",
                    drawing: "ڈرائنگ سرگرمی",
                    progress: "ترقی",
                    timeRemaining: "باقی وقت",
                    questionsRemaining: "باقی سوالات",
                    totalQuestions: "کل سوالات",
                    correctAnswers: "درست جوابات",
                    percentage: "فیصد"
                },
                messages: {
                    welcomeTitle: "آپ کی تعلیمی سفر میں خوش آمدید!",
                    welcomeText: "مزیدار اور انٹرایکٹو سبق کے ساتھ سیکھنا شروع کرنے کے لیے اپنا معیار منتخب کریں۔",
                    schoolName: "پرائمری اسکول لرننگ ایپ",
                    lessonCompleted: "سبق کامیابی سے مکمل ہوا!",
                    quizCompleted: "کوئز مکمل ہوا!",
                    drawingSaved: "ڈرائنگ کامیابی سے محفوظ ہو گئی!",
                    progressSaved: "ترقی محفوظ ہو گئی!",
                    offlineMode: "آپ فی الحال آف لائن ہیں۔ کچھ خصوصیات محدود ہو سکتی ہیں۔",
                    syncComplete: "ڈیٹا کامیابی سے سینک ہو گیا!",
                    errorLoading: "مواد لوڈ کرنے میں غلطی۔ براہ کرم دوبارہ کوشش کریں۔",
                    networkError: "نیٹ ورک غلطی۔ براہ کرم اپنا کنکشن چیک کریں۔",
                    unsavedChanges: "آپ کے پاس غیر محفوظ شدہ تبدیلیاں ہیں۔ کیا آپ واقعی چھوڑنا چاہتے ہیں؟",
                    confirmDelete: "کیا آپ واقعی اس آئٹم کو حذف کرنا چاہتے ہیں؟",
                    confirmReset: "کیا آپ واقعی اپنی ترقی کو ری سیٹ کرنا چاہتے ہیں؟"
                }
            }
        };
    }

    /**
     * Initialize language manager
     */
    init() {
        // Load current language from settings
        this.currentLanguage = this.getStoredLanguage();
        
        // Load translations
        this.loadTranslations(this.currentLanguage);
        
        // Apply translations
        this.applyTranslations();
        
        // Set up language change listeners
        this.setupLanguageChangeListeners();
        
        console.log('Language Manager initialized with language:', this.currentLanguage);
    }

    /**
     * Get stored language from localStorage
     */
    getStoredLanguage() {
        try {
            const stored = localStorage.getItem('userSettings');
            if (stored) {
                const settings = JSON.parse(stored);
                return settings.language || 'en';
            }
        } catch (error) {
            console.error('Error loading stored language:', error);
        }
        return 'en';
    }

    /**
     * Load translations for a specific language
     */
    async loadTranslations(language) {
        if (this.loadedLanguages.has(language)) {
            return;
        }

        try {
            // For now, use the embedded translation data
            // In a real app, you might load from external files
            this.translations[language] = this.translationData[language];
            this.loadedLanguages.add(language);
            
            console.log(`Translations loaded for language: ${language}`);
        } catch (error) {
            console.error(`Error loading translations for ${language}:`, error);
            // Fallback to English
            if (language !== this.fallbackLanguage) {
                await this.loadTranslations(this.fallbackLanguage);
            }
        }
    }

    /**
     * Set language
     */
    async setLanguage(language) {
        if (language === this.currentLanguage) {
            return;
        }

        try {
            // Load translations if not already loaded
            await this.loadTranslations(language);
            
            // Update current language
            this.currentLanguage = language;
            
            // Update document attributes
            document.documentElement.lang = language;
            document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
            
            // Apply translations
            this.applyTranslations();
            
            // Save to localStorage
            this.saveLanguageSetting(language);
            
            // Trigger language change event
            this.triggerLanguageChangeEvent();
            
            console.log(`Language changed to: ${language}`);
            
        } catch (error) {
            console.error('Error setting language:', error);
        }
    }

    /**
     * Apply translations to the DOM
     */
    applyTranslations() {
        const elements = document.querySelectorAll('[data-translate]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getTranslation(key);
            
            if (translation) {
                // Handle different element types
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else if (element.tagName === 'IMG') {
                    element.alt = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    }

    /**
     * Get translation for a specific key
     */
    getTranslation(key) {
        try {
            const keys = key.split('.');
            let translation = this.translations[this.currentLanguage];
            
            for (const k of keys) {
                if (translation && translation[k]) {
                    translation = translation[k];
                } else {
                    // Fallback to English
                    translation = this.translations[this.fallbackLanguage];
                    for (const fallbackKey of keys) {
                        if (translation && translation[fallbackKey]) {
                            translation = translation[fallbackKey];
                        } else {
                            return key; // Return original key if translation not found
                        }
                    }
                    break;
                }
            }
            
            return translation || key;
        } catch (error) {
            console.error('Error getting translation:', error);
            return key;
        }
    }

    /**
     * Get translation with parameters
     */
    getTranslationWithParams(key, params = {}) {
        let translation = this.getTranslation(key);
        
        // Replace parameters in translation
        Object.keys(params).forEach(param => {
            const regex = new RegExp(`{${param}}`, 'g');
            translation = translation.replace(regex, params[param]);
        });
        
        return translation;
    }

    /**
     * Save language setting to localStorage
     */
    saveLanguageSetting(language) {
        try {
            const stored = localStorage.getItem('userSettings');
            const settings = stored ? JSON.parse(stored) : {};
            settings.language = language;
            localStorage.setItem('userSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving language setting:', error);
        }
    }

    /**
     * Set up language change listeners
     */
    setupLanguageChangeListeners() {
        // Listen for language button clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('lang-btn')) {
                const language = e.target.dataset.lang;
                if (language) {
                    this.setLanguage(language);
                }
            }
        });
    }

    /**
     * Trigger language change event
     */
    triggerLanguageChangeEvent() {
        const event = new CustomEvent('languageChanged', {
            detail: {
                language: this.currentLanguage,
                direction: this.currentLanguage === 'ur' ? 'rtl' : 'ltr'
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get text direction for current language
     */
    getTextDirection() {
        return this.currentLanguage === 'ur' ? 'rtl' : 'ltr';
    }

    /**
     * Check if language is RTL
     */
    isRTL() {
        return this.currentLanguage === 'ur';
    }

    /**
     * Get available languages
     */
    getAvailableLanguages() {
        return Object.keys(this.translationData);
    }

    /**
     * Get language name in native script
     */
    getLanguageName(language) {
        const names = {
            en: 'English',
            ta: 'தமிழ்',
            ur: 'اردو'
        };
        return names[language] || language;
    }

    /**
     * Format number according to language
     */
    formatNumber(number, language = null) {
        const lang = language || this.currentLanguage;
        
        // For now, use standard number formatting
        // In a real app, you might use Intl.NumberFormat
        return number.toLocaleString();
    }

    /**
     * Format date according to language
     */
    formatDate(date, language = null) {
        const lang = language || this.currentLanguage;
        
        // For now, use standard date formatting
        // In a real app, you might use Intl.DateTimeFormat
        return date.toLocaleDateString();
    }

    /**
     * Get plural form for a number
     */
    getPluralForm(number, forms, language = null) {
        const lang = language || this.currentLanguage;
        
        // Simple plural rules for now
        if (lang === 'en') {
            return number === 1 ? forms[0] : forms[1];
        } else if (lang === 'ta') {
            // Tamil has more complex plural rules
            return number === 1 ? forms[0] : forms[1];
        } else if (lang === 'ur') {
            // Urdu plural rules
            return number === 1 ? forms[0] : forms[1];
        }
        
        return forms[1]; // Default to plural
    }
}

// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.LanguageManager = new LanguageManager();
    window.LanguageManager.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
} 