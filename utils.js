export const registerForm = document.querySelector("#register-form");
export const loginForm = document.querySelector("#login-form");
export const noteForm = document.querySelector("#note-form");
const shareForm = document.querySelector(".share-notes");

let token = "";

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false,
  timeZoneName: "short",
};

export const getToken = () => token;

export const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

export const showLogin = () => {
  registerForm.parentElement.classList.add("hidden");
  loginForm.parentElement.classList.remove("hidden");
  noteForm.parentElement.classList.add("hidden");
};

export const showRegister = () => {
  registerForm.parentElement.classList.remove("hidden");
  loginForm.parentElement.classList.add("hidden");
  noteForm.parentElement.classList.add("hidden");
};

export const showNoteForm = () => {
  registerForm.parentElement.classList.add("hidden");
  loginForm.parentElement.classList.add("hidden");
  noteForm.parentElement.classList.remove("hidden");
};

export const register = async (username, password) => {
  let data = await fetch("http://localhost:3000/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username, password: password }),
  });
  data = await data.json();
  return data;
};

export const login = async (username, password) => {
  let data = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username, password: password }),
  });
  data = await data.json();
  setToken(data.token);
  return data;
};

export const newNote = async (note) => {
  const url = await getCurrentTab();
  let data = await fetch("http://localhost:3000/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({ url: url, note: note }),
  });
  data = await data.json();
  return data;
};

export const fillNotes = async () => {
  const currentTab = await getCurrentTab();
  let user = await getUserByToken(token);
  let data = await fetch(`http://localhost:3000/api/users/${user.id}`);
  data = await data.json();
  let notes = await data.notes;
  notes = await notes.filter((note) => {
    return note.url === currentTab ? true : false;
  });
  // sort notes by date
  await notes.sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
  clearNotes();
  for (let note of notes) {
    const noteDiv = document.createElement("div");
    let timestamp = new Date(note.timestamp);
    timestamp = timestamp.toLocaleString("default", options);
    noteDiv.innerHTML = `<div class="note">${note.note}</div><div class="light-text">${timestamp}</div>`;
    document.querySelector(".notes").appendChild(noteDiv);
  }
  //true if shared notes are to be shown
  //   const shared = checkShared();
  //   if (shared) {
  // encode current tab url to match with notes url
  const sharedNotes = await data.shared[btoa(currentTab)];
  if (sharedNotes) {
    const sharedNotesDiv = document.createElement("div");
    sharedNotesDiv.classList.add("shared-notes");
    for (let user of sharedNotes) {
      let userNotes = await getUserByUsername(user);
      userNotes = await userNotes.notes;
      userNotes = await userNotes.filter((note) =>
        note.url === currentTab ? true : false
      );
      for (let note of userNotes) {
        const noteDiv = document.createElement("div");
        let timestamp = new Date(note.timestamp);
        timestamp = timestamp.toLocaleString("default", options);
        noteDiv.innerHTML = `<div class="note">${note.note}</div><div class="light-text">${timestamp}</div> <div class="light-text">Shared by ${user}</div>`;
        sharedNotesDiv.appendChild(noteDiv);
      }
    }
    document.querySelector(".notes").appendChild(sharedNotesDiv);
    // }
  }
};

export const getCurrentTab = async () => {
  let currentTab;
  const tabs = await chrome.tabs.query({ currentWindow: true, active: true });
  currentTab = tabs[0].url;
  return currentTab;
};

// encodes url to base64 as Mongoose maps do not support keys that contain "."
export const shareSiteNotes = async (username, withUsername) => {
  const url = await getCurrentTab();
  const encodedUrl = btoa(url);
  const withUser = await getUserByUsername(withUsername);
  if (!withUser) return;
  const addSharedUser = await fetch(
    `http://localhost:3000/api/users/${withUser.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, url: encodedUrl }),
    }
  );
  shareForm.reset();
//   const shareUrl = `${url}?usp=share`;
//   document.querySelector(".url-div").classList.remove("hidden");
//   const urlInput = document.querySelector("#url");
//   urlInput.value = shareUrl;
//   urlInput.select();
  return addSharedUser;
};

const clearNotes = () => {
  const notes = document.querySelectorAll(".notes > div");
  notes.forEach((note) => note.remove());
};

// Returns true if usp is shared, else false
// const checkShared = async () => {
//   const url = await getCurrentTab();
//   const queryParameters = await url.split("?")[1];
//   const urlParameters = new URLSearchParams(queryParameters);
//   const currentVideo = urlParameters.get("usp");
//   if (currentVideo === "share") {
//     return true;
//   }
//   return false;
// };

//Source:- https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
export const copyTextToClipboard = (text) => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
};

const fallbackCopyTextToClipboard = (text) => {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
};

const getUserByToken = async (token) => {
  let user = await fetch("http://localhost:3000/api/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
  });
  user = await user.json();
  return user;
};

const getUserByUsername = async (username) => {
  let allUsers = await fetch("http://localhost:3000/api/users");
  allUsers = await allUsers.json();
  const user = await allUsers.find((user) => {
    return user.username === username;
  });
  return user;
};
