// main.js — ホーム & ホストログイン処理
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- TODO: ここにあなたの firebaseConfig を入れる ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // storageBucket, messagingSenderId, appId は任意
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
