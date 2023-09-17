window.addEventListener("load", (event) => {
  fetch("data.json", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((response) => {
      const questions = response;
      const container = document.getElementById("main");
      const qID = Object.keys(questions);
      let count = 1;
      qID.map((q) => {
        const curr = questions[q];
        container.appendChild(createQuestion(curr, q, count));
        count++;
      });
    });
});

function createQuestion(obj, id, num) {
  const q = obj;
  const qElem = createDiv("", "questionline", id);
  const nElem = createDiv(" #" + num, "number", "num_" + num);
  const qCaption = createDiv("", "Qtxt", "");
  const qCaptionTxt = createDiv(q.Text, "QuestionText", "");
  qCaption.appendChild(nElem);
  qCaption.appendChild(qCaptionTxt);

  qElem.appendChild(qCaption);
  let qText = q.Text;
  for (let i = 0; i < q.Letters.length; i++) {
    const l = q.Letters[i];
    qText = qText.replace(" " + l, createInputText(id, l, i));
    // console.log("qText :>> ", qText);
  }
  const qInputs = createDiv(qText, "inputs", `${id}_inputs`);
  qElem.appendChild(qInputs);
  const qButton = createButton("Check", "check", `${id}_check`, () => {
    if (checkLineAnswers(q, id) === true) {
      qCaption.classList.add("correct");
      qCaption.classList.remove("incorrect");
      console.log(id, "correct");
    } else {
      qCaption.classList.remove("correct");
      qCaption.classList.add("incorrect");
      console.log(id, "incorrect");
    }
  });
  qElem.appendChild(qButton);
  return qElem;
}

function createInputText(id, letter, i) {
  return `<input class="input" id="${id}_${letter}_${i}" value="${letter}" >`;
}

function createDiv(innerHTML, className, id) {
  const div = document.createElement("div");
  div.id = id + "_container";
  div.classList.add(className);
  div.innerHTML = innerHTML;
  return div;
}
function createButton(innerHTML, className, id, clickHandler) {
  const div = createDiv(innerHTML, className, id);
  div.id = id + "_button";
  div.classList.add("button");
  div.onclick = clickHandler;
  return div;
}

function checkLineAnswers(obj, qid) {
  for (let i = 0; i < obj.Letters.length; i++) {
    const l = obj.Letters[i];
    const a = obj.Answers[i].trim();
    const id = `${qid}_${l}_${i}`;
    let alt = obj.Alt !== undefined ? obj.Alt[i] : a;

    const qInput = document.getElementById(id);
    const itxt = qInput.value.toUpperCase().trim();
    if (itxt !== a.toUpperCase && itxt !== alt.toUpperCase()) {
      console.log(i, "entered:", itxt, "correct:", a);
      return false;
    }
  }

  return true;
}
