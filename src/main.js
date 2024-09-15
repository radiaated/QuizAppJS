import "./style.css";
import { quizController } from "./quizController";
import { UIController } from "./UIController";

// Main app controller

const controller = ((quizCtrl, UICtrl) => {
  // Initializes the app UI
  const init = () => {
    document.querySelector("#app").innerHTML = `
      <h1 id='id__app_title'>Quiz app</h1>
      <div id='id__dynmaic_app'>
      </div>
      <footer>Made by <a href="https://github.com/radiaated">radiaated</a></footer>
      `;

    UICtrl.initUI();

    const domstr = UICtrl.getDOMString();
    document.querySelector(domstr.initQuizForm).onsubmit = (event) => {
      event.preventDefault();

      const username = event.target.username.value;
      const questionCount = event.target.questioncount.value;
      startQuiz(username, questionCount);
    };
    return document
      .querySelector(domstr.initQuizForm)
      .removeEventListener("submit", () => {});
  };

  // Starts the quiz
  const startQuiz = (username, questionCount) => {
    const validation = quizCtrl.validateSetupQuiz(username, questionCount);

    if (!validation.isValid) {
      UICtrl.displaySetupQuizError(validation.validationMessage);
      console.log("a");

      return;
    }

    const domstr = UICtrl.getDOMString();

    const quizState = quizCtrl.setupQuizData(username, parseInt(questionCount));

    UICtrl.setupQuizUI();
    UICtrl.displayUsername(quizState.username);
    loadQA();

    document.querySelector(domstr.quizForm).onsubmit = (event) => {
      event.preventDefault();

      const submittedAnswer = Array.from(event.target.choice)
        .filter((choice) => choice.checked)
        .map((choice) => parseInt(choice.value));

      if (submittedAnswer.length === 0) {
        UICtrl.dispayQuizSubmitError("Choose at least one option!");
        return;
      }

      quizCtrl.onQuizSubmit(
        parseInt(
          document.querySelector(domstr.quizForm).getAttribute("data-qid")
        ),
        submittedAnswer
      );

      UICtrl.onQuizSubmit();
      loadQA();
    };

    return document
      .querySelector(domstr.quizForm)
      .removeEventListener("submit", () => {});
  };

  // Loads the quiz and choices
  const loadQA = () => {
    const qa = quizCtrl.loadQAData();

    console.log(qa);

    if (qa.status === "COMPLETED") {
      onQuizCompleted();
      return;
    }

    UICtrl.updateQAUI(qa);
  };

  const onQuizCompleted = () => {
    const score = quizCtrl.onQuizCompleted();
    UICtrl.onQuizCompleted(score);
    const domstr = UICtrl.getDOMString();
    console.log("completed");

    document.querySelector(domstr.btnReplay).addEventListener("click", () => {
      resetQuiz();
    });

    return document
      .querySelector(domstr.btnReplay)
      .removeEventListener("click", () => {});
  };

  // Reset the quiz data and re intializes the app UI

  const resetQuiz = () => {
    quizCtrl.resetQuiz();
    init();
  };

  return {
    init,
  };
})(quizController, UIController);

controller.init();
