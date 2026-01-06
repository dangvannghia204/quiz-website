function login() {
  const email = email.value;
  const password = password.value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => location.href = "quiz.html")
    .catch(err => alert(err.message));
}

auth.onAuthStateChanged(user => {
  if (!user && !location.href.includes("index")) {
    location.href = "index.html";
  }
});
