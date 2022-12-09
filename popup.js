import {
  registerForm,
  loginForm,
  noteForm,
  showRegister,
  showLogin,
  showNoteForm,
  register,
  login,
  newNote,
  fillNotes,
  shareSiteNotes,
} from "./utils.js";

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = registerForm["username"].value;
  const password = registerForm["password"].value;
  const data = await register(username, password);
  if (!data.error) {
    registerForm["username"].value = "";
    registerForm["password"].value = "";
    showLogin();
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = loginForm["username"].value;
  const password = loginForm["password"].value;
  const data = await login(username, password);
  if (!data.error) {
    loginForm["username"].value = "";
    loginForm["password"].value = "";
    data.token && localStorage.setItem("user", JSON.stringify(data));
    showNoteForm();
    fillNotes();
  }
});

noteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const noteTextArea = document.querySelector("#note");
  const note = noteTextArea.value;
  noteTextArea.value = "";
  await newNote(note);
  fillNotes();
});

document.querySelector("#switch-to-register").addEventListener("click", () => {
  showRegister();
});

document.querySelector("#switch-to-login").addEventListener("click", () => {
  showLogin();
});

document.querySelector(".share-notes").addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem("user")).username;
  const withUsername = e.target["username"].value;
  if (user === withUsername) return;
  await shareSiteNotes(user, withUsername);
});

// document.querySelector("#copy-url").addEventListener("click", (e) => {
//   const url = e.target.previousSibling.previousSibling.value;
//   copyTextToClipboard(url);
// });
