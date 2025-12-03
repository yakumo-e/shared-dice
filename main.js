// main.js — ホーム & ホストログイン処理
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- TODO: ここにあなたの firebaseConfig を入れる ---
const firebaseConfig = {
  apiKey: "AIzaSyCzNPF0V5l9vzge_SjuQOG4DlqCSBkUWHE",
  authDomain: "dice-4cc18.firebaseapp.com",
  projectId: "dice-4cc18",
  storageBucket: "dice-4cc18.firebasestorage.app",
  messagingSenderId: "793455017758",
  appId: "1:793455017758:web:00357a1c9c156d9cea130f",
  measurementId: "G-CHQ67JNMYH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("title").onclick = () => {
  location.href = "index.html";
};

function enterRoom() {
  location.href = "tab.html";
}
window.enterRoom = enterRoom;

// ホストログイン（簡易）
document.getElementById("loginBtn").onclick = async () => {
  const email = prompt("ホスト用メールを入力してください（例: yakumo@dice.com）");
  const pass = prompt("パスワードを入力してください");
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    alert("ホストログイン成功");
  } catch (e) {
    alert("ログイン失敗: " + e.message);
  }
};
