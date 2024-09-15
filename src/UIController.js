export const UIController = (() => {
  // DOM strings like id and class name for elements

  const DOMString = {
    dynamicAppContainer: "#id__dynmaic_app",
    initQuizForm: "#id__init_quiz__form",
    username: "#id__username",
    usernameError: "#id__username_error",
    questionCountError: "#id__questioncount_error",
    currentLevel: "#id__current_level",
    questionTitle: "#id__title__question",
    quizContainer: "#id__quiz_container",
    quizStage: "#id__quiz_stage",
    quizForm: "#id__quiz_form",
    choicesList: "#id__choices__list",
    classChoiceItem: ".choice-item",
    choiceItem1: "#id__choice_0__item",
    choiceItem2: "#id__choice_1__item",
    choiceItem3: "#id__choice_2__item",
    choiceItem4: "#id__choice_3__item",
    quizSubmitError: "#id__quiz_submit_error",
    btnReplay: "#id__btn__replay",
  };

  // Performs fade out then in animation for a given HTML element

  const fadeOutInAnimation = (animatedElementDOMString, callback, time) => {
    const animatedElement = document.querySelector(animatedElementDOMString);

    if (animatedElement.classList.contains("fade-in")) {
      animatedElement.classList.remove("fade-in");
      animatedElement.classList.add("fade-out");
      setTimeout(() => {
        animatedElement.classList.remove("fade-out");
        animatedElement.classList.add("fade-in");
      }, time / 2);

      setTimeout(() => {
        callback();
      }, time / 2);
    } else {
      animatedElement.classList.add("fade-in");
      callback();
    }
  };

  return {
    // Initializes the home UI

    initUI: () => {
      document.querySelector(DOMString.dynamicAppContainer).innerHTML = `
        <div class="container fade-in">
          <form id="id__init_quiz__form">
            <div class="form-group">
              <label>Username* <span id="id__username_error" class="setup-quiz-input-error"></span></label>
              <input type="username" name="username" placeholder="Username"  />
            </div>
            <div class="form-group">
              <label>Number of questions* <span id="id__questioncount_error" class="setup-quiz-input-error"></span></label>
              <input type="number" name="questioncount" placeholder="Question count" />
            </div>
            <div class="form-group">
            
              <input type="submit" value="Play" />
            </div>
          </form>
          
        </div>
        <div id="id__quiz_rules">
          <div><strong>Rules:</strong></div>
          <ul>
            <li>A question can have one or multiple correct answers.</li>
            <li>Correct answers for a question get you 5 points.</li>
            <li>For questions with multiple correct answers, each correct answer will earn 5 points divided by the total number of correct answers.</li>
          </ul>
        </div>
      `;
    },

    // Displays error message when username and question count is not valid

    displaySetupQuizError: (errorsMessage) => {
      console.log(errorsMessage);

      if (errorsMessage.hasOwnProperty("username")) {
        document.querySelector(
          DOMString.usernameError
        ).innerHTML = `<span>${errorsMessage.username}</span>`;
      }
      if (errorsMessage.hasOwnProperty("questionCount")) {
        document.querySelector(
          DOMString.questionCountError
        ).innerHTML = `<span>${errorsMessage.questionCount}</span>`;
      }
    },

    // Displays up the quiz UI

    setupQuizUI: () => {
      document.querySelector(DOMString.dynamicAppContainer).innerHTML = `
      <div id="id__quiz_container">
         <div id="quiz-header">
            <div id="id__username">Username</div>
            <div id="id__current_level">Question <span id="id__active_level">1</span> of <span id="id__total-level">1</span></div>
         </div>
         <div id="id__quiz_stage" class="card">
         <div id="id__quiz_submit_error"></div>
         <h2 id="id__title__question">Quiz question</h2>
         <form id="id__quiz_form">
            <div id="id__choices__list">
               <div class="choice-item">
                  <label for="id__choice_0__item">Choice A</label><input type="checkbox" name="choice" id="id__choice_0__item" />
               </div>
               <div class="choice-item">
                  <label for="id__choice_1__item">Choice B</label><input type="checkbox" name="choice" id="id__choice_1__item" />
               </div>
               <div class="choice-item">
                  <label for="id__choice_2__item">Choice C</label><input type="checkbox" name="choice" id="id__choice_2__item" />
               </div>
               <div class="choice-item">
                  <label for="id__choice_3__item">Choice D</label><input type="checkbox" name="choice" id="id__choice_3__item" />
               </div>
            </div>
            <input type="submit" value="Submit answer">
         </form>
         </div>
      </div>
        `;
    },

    // Displays error when users doesn't select any choices

    dispayQuizSubmitError: (errorsMessage) => {
      document.querySelector(DOMString.quizSubmitError).innerHTML =
        errorsMessage;
    },

    // Returns the DOMString object

    getDOMString: () => {
      return DOMString;
    },

    // Displays the username
    displayUsername: (username) => {
      document.querySelector(DOMString.username).innerHTML = username;
    },

    // Updates the UI for quiz and choices

    updateQAUI: (quizData) => {
      fadeOutInAnimation(
        DOMString.quizStage,
        () => {
          document.querySelector(DOMString.questionTitle).innerHTML =
            quizData.questionTitle;
          const choicesHtml = quizData.choices.map(
            (choice, i) =>
              `
                <div class="choice-item">
                    <label for="id__choice_${i}__item">${choice}</label><input type="checkbox" id="id__choice_${i}__item" name="choice" value="${i}" />
                </div>
            `
          );

          document
            .querySelector(DOMString.quizForm)
            .setAttribute("data-qid", quizData.questionId);

          document.querySelector(DOMString.choicesList).innerHTML =
            choicesHtml.join("");

          document.querySelector(
            DOMString.currentLevel
          ).innerHTML = `Question <span id="id__active_level">${
            quizData.levelData.currentLevel + 1
          }</span> of <span id="id__total-level">${
            quizData.levelData.totalLevel
          }</span>`;

          const choiceItems = document.querySelectorAll(
            DOMString.classChoiceItem
          );

          for (let ci of choiceItems) {
            console.log(ci);
            ci.addEventListener("click", (event) => {
              if (event.target.querySelector('[name="choice"]')) {
                event.target.querySelector('[name="choice"]').checked =
                  !event.target.querySelector('[name="choice"]').checked;

                event.target
                  .querySelector('[name="choice"]')
                  .dispatchEvent(new Event("change"));
              }
            });
          }

          const choiceInputs = document.querySelectorAll('[name="choice"]');

          for (let ci of choiceInputs) {
            ci.addEventListener("change", (event) => {
              console.log("change");

              ci.parentElement.classList.toggle(
                "checked-choice-item",
                event.target.checked
              );
            });
          }
        },
        250
      );
    },

    // Handles HTML element attribute on quiz question submission
    onQuizSubmit: () => {
      document.querySelector(DOMString.quizForm).removeAttribute("data-qid");
    },

    // Handles the UI on the quiz completion

    onQuizCompleted: (resultData) => {
      console.log(resultData);

      document.querySelector(DOMString.quizStage).innerHTML = `
      <div id="id__result">
        <div>
          Score: <div id="id__score">${resultData.totalScore.toFixed(2)}</div>
        </div>
        <div>
          <button id="id__btn__replay">Play again</button>
        </div>
        <hr />
        <small>Submissions</small>
        <div id="id__user_answer_history">
        ${resultData.userAnswerHistory
          .map((uah) => {
            return `<div class="user_answer_history_item">
                <div class="uah_question">${
                  uah.questionTitle
                }</div> <div class="uah_answers_list"> ${uah.userSubmittedAnswerInText
              .map((usait) => {
                return `<div class="${
                  usait.isCorrect
                    ? "result__correct_choice"
                    : "result__incorrect_choice"
                }">${usait.answer}</div>`;
              })
              .join("")}
              </div></div>`;
          })
          .join("")}
          
          
        </div>
      </div>
      `;

      document.querySelector(DOMString.quizContainer).classList.add("fade-in");
    },
  };
})();
