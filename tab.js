import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore, doc, getDoc, setDoc,
  addDoc, collection, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ✅ Firebase設定
const app = initializeApp({ あなたのキー });
const db = getFirestore(app);
const auth = getAuth(app);

const rollBtn = document.getElementById("rollBtn");
const fixed = document.getElementById("fixedResult");
const hostPanel = document.getElementById("hostPanel");
const logList = document.getElementById("logList");

let canRoll = true; // ✅ 連打防止フラグ

// ✅ ダイス設定を取得
async function getConfig() {
  const snap = await getDoc(doc(db, "config", "dice"));
  return snap.data();
}

// ✅ ロール演出付きダイス
async function rollDice() {
  if (!canRoll) return;

  canRoll = false;
  rollBtn.disabled = true;
  rollBtn.textContent = "ロール中…";

  const config = await getConfig();

  let counter = 0;
  const anim = setInterval(() => {
    let animText = "";
    for (let i = 0; i < config.w; i++) {
      const r = Math.floor(Math.random() * config.x) + 1;
      animText += `${String.fromCharCode(119 + i)}:${r} `;
    }
    fixed.textContent = animText;
    counter++;
  }, 100);

  setTimeout(async () => {
    clearInterval(anim);

    let result = "";
    for (let i = 0; i < config.w; i++) {
      const r = Math.floor(Math.random() * config.x) + 1;
      result += `${String.fromCharCode(119 + i)}:${r} `;
    }

    fixed.textContent = result;

    // ✅ ログ保存（IPなし）
    await addDoc(collection(db, "logs"), {
      result,
      time: Date.now()
    });

    // ✅ クールタイム 3秒
    setTimeout(() => {
      canRoll = true;
      rollBtn.disabled = false;
      rollBtn.textContent = "ロール";
    }, 3000);

  }, 1200);
}

rollBtn.onclick = rollDice;
rollDice(); // 入室時自動ロール

// ✅ ホスト判定
onAuthStateChanged(auth, user => {
  if (user) {
    hostPanel.style.display = "block";
  }
});

// ✅ ログ監視（ホストのみ表示）
onSnapshot(collection(db, "logs"), snap => {
  logList.innerHTML = "";
  snap.forEach(d => {
    const li = document.createElement("li");
    li.textContent =
      new Date(d.data().time).toLocaleString() + " | " + d.data().result;
    logList.appendChild(li);
  });
});
