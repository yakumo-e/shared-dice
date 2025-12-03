import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = { あなたのキー };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("title").onclick = () => {
  location.href = "index.html";
};

function enterRoom() {
  location.href = "tab.html";
}
window.enterRoom = enterRoom;

document.getElementById("loginBtn").onclick = async () => {
  await signInWithEmailAndPassword(auth, "yakumo@dice.com", "password");
  alert("ホストログイン成功");
};
