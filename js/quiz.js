let questions = [];
const PASS_SCORE = 50;

// ===== TIMER =====
let duration = 30 * 60;
let leaveCount = 0;
const MAX_LEAVE = 3;

// ===== LOAD CSV =====
fetch("data/questions.csv")
  .then(res => res.text())
  .then(csv => {
    Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
      complete: r => {
        questions = r.data;
        shuffle(questions);
        render();
        startTimer();
      }
    });
  });

// ===== SHUFFLE =====
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ===== RENDER =====
function render() {
  const quiz = document.getElementById("quiz");
  quiz.innerHTML = "";

  questions.forEach((q, i) => {
    const opts = [q.OptionA, q.OptionB, q.OptionC, q.OptionD];
    shuffle(opts);

    quiz.innerHTML += `
      <div class="mb-3">
        <b>${i + 1}. ${q.Question}</b>
        ${opts.map(o => `
          <div class="form-check">
            <input class="form-check-input" type="radio" name="q${i}" value="${o}">
            <label class="form-check-label">${o}</label>
          </div>`).join("")}
      </div>
    `;
  });
}

// ===== TIMER =====
function startTimer() {
  const t = document.getElementById("timer");

  setInterval(() => {
    let m = Math.floor(duration / 60);
    let s = duration % 60;
    t.innerText = `${m}:${s.toString().padStart(2, "0")}`;

    if (duration-- <= 0) {
      alert("Hết giờ!");
      submitQuiz();
    }
  }, 1000);
}

// ===== SUBMIT =====
function submitQuiz() {
  let correct = 0;

  questions.forEach((q, i) => {
    const c = document.querySelector(`input[name=q${i}]:checked`);
    if (c && c.value === q.CorrectAnswer) correct++;
  });

  const percent = correct / questions.length * 100;
  const status = percent >= PASS_SCORE ? "Đạt" : "Không đạt";

  db.collection("results").add({
    email: auth.currentUser.email,
    correct,
    total: questions.length,
    percent,
    status,
    submittedAt: new Date().toISOString()
  });

  alert(`Kết quả: ${percent.toFixed(1)}% – ${status}`);
  auth.signOut();
}

// ===== ANTI TAB =====
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    leaveCount++;
    alert(`Bạn đã rời tab ${leaveCount} lần`);
    if (leaveCount >= MAX_LEAVE) submitQuiz();
  }
});

window.onbeforeunload = () => "Bạn chắc chắn muốn thoát?";
