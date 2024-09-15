import { quizData } from "./data";

// Controls the quiz data

export const quizController = (() => {
  // Initial quiz data

  let data = {
    username: "",
    questionList: [],
    currentLevel: -1,
    submission: [],
    questionCount: -1,
    totalScore: 0,
  };

  return {
    // Validates the username and question count

    validateSetupQuiz: (username, questionsCount) => {
      let isValid = true;

      let validationMessage = {};

      if (username.length === 0) {
        validationMessage.username = "Username can't be empty";
        isValid = false;
      }
      if (!questionsCount) {
        validationMessage.questionCount = "Number of questions can't be empty";
        isValid = false;
      } else {
        if (questionsCount < 3) {
          validationMessage.questionCount =
            "Number of questions must be greater or equal to 3";
          isValid = false;
        }
        if (questionsCount > 50) {
          validationMessage.questionCount =
            "Number of questions must be less or equal to 50";
          isValid = false;
        }
      }
      return {
        isValid,
        validationMessage,
      };
    },

    // Sets up the quiz with user's username and question count

    setupQuizData: (username, questionsCount) => {
      const questionSet = new Set();

      while (questionSet.size < questionsCount) {
        questionSet.add(
          quizData.questionsList[Math.floor(Math.random(questionsCount) * 50)]
        );
      }

      const partialData = {
        username,
        currentLevel: 0,
        questionCount: questionsCount,
        questionList: Array.from(questionSet),
      };

      data = { ...data, ...partialData };

      return partialData;
    },

    // Load question and choices for the current level

    loadQAData: () => {
      if (data.currentLevel === data.questionCount) {
        return {
          status: "COMPLETED",
        };
      }

      return {
        status: "IN_PROGRESS",
        levelData: {
          currentLevel: data.currentLevel,
          totalLevel: data.questionCount,
        },
        questionTitle: data.questionList[data.currentLevel].questionTitle,
        questionId: data.questionList[data.currentLevel].id,
        choices: data.questionList[data.currentLevel].choices,
      };
    },

    // Handles the quiz data on a quiz question submission

    onQuizSubmit: (questionId, submittedAnswer) => {
      data.submission.push({ questionId, submittedAnswer });
      data.currentLevel += 1;
    },

    // Gets the current level of the user

    getCurrentStatus: () => {
      return {
        username: data.username,
        currentLevel: data.currentLevel,
      };
    },

    // Handles the quiz data on quiz completion
    onQuizCompleted: () => {
      let userAnswerHistory = [];
      let totalScore = 0;

      for (let ds of data.submission) {
        const question = data.questionList.find(
          (qn) => qn.id === ds.questionId
        );

        let userSubmittedAnswerInText = [];

        for (let sa of ds.submittedAnswer) {
          let isCorrect = false;

          if (question.answerIndex.includes(sa)) {
            isCorrect = true;
            totalScore += 5 / question.answerIndex.length;
          }
          userSubmittedAnswerInText.push({
            answer: question.choices[sa],
            isCorrect,
          });
        }
        userAnswerHistory.push({
          questionTitle: question.questionTitle,
          userSubmittedAnswerInText,
        });
      }

      return {
        userAnswerHistory,
        totalScore,
        questionCount: data.questionCount,
      };
    },

    // Resets all the quiz data

    resetQuiz: () => {
      data = {
        username: "",
        questionList: [],
        currentLevel: -1,
        submission: [],
        questionCount: -1,
        totalScore: 0,
      };
    },
  };
})();
