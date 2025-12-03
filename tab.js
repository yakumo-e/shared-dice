import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore, doc, getDoc, setDoc, addDoc, collection, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- TODO: ここに同じ firebaseConfig を入れる ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const rollBtn = document.getElementById("rollBtn");
const fixed = document.getElementById("fixedResult");
const hostPanel = document.getElementById("hostPanel");
const logList = document.getElementById("logList");
const wCountInput = document.getElementById("wCount");
const xRangeInput = document.getElementById("xRange");
const saveConfigBtn = document.getElementById("saveConfig");
const hostTextArea = document.getElementById("hostText");

let canRoll = true;

// デフォルトがない場合に備えた初期化
async function ensureConfig() {
  const ref = doc(db, "config", "dice");
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { w: 1, x: 6, hostText: "ようこそ" });
  }
}

// 設定取得
async function getConfig() {
  const snap = await getDoc(doc(db, "config", "dice"));
  return snap.exists() ? snap.data() : { w:1, x:6, hostText:"" };
}

// ロール演出付きダイス
async function rollDice() {
  if (!canRoll) return;
  canRoll = false;
  rollBtn.disabled = true;
  rollBtn.textContent = "ロール中…";

  const config = await getConfig();

  // アニメーション（100ms ごとに切り替え）
  const anim = setInterval(() => {
    let animText = "";
    for (let i = 0; i < config.w; i++) {
      const r = Math.floor(Math.random() * config.x) + 1;
      animText += `${String.fromCharCode(119 + i)}:${r} `;
    }
    fixed.textContent = animText;
  }, 100);

  // 1.2秒後に確定
  setTimeout(async () => {
    clearInterval(anim);
    let result = "";
    for (let i = 0; i < config.w; i++) {
      const r = Math.floor(Math.random() * config.x) + 1;
      result += `${String.fromCharCode(119 + i)}:${r} `;
    }
    fixed.textContent = result;

    // ログ保存（IPは保存しない）
    await addDoc(collection(db, "logs"), {
      result,
      time: Date.now()
    });

    // 3秒クールタイム
    setTimeout(() => {
      canRoll = true;
      rollBtn.disabled = false;
      rollBtn.textContent = "ロール";
    }, 3000);

  }, 1200);
}

rollBtn.onclick = rollDice;

// 入室時に自動ロール（ページ読み込みで実行）
window.addEventListener('load', async () => {
  await ensureConfig();
  rollDice();
});

// ホスト判定
onAuthStateChanged(auth, user => {
  if (user) {
    hostPanel.style.display = "block";
    // ホストが入れば設定を読み込み
    getDoc(doc(db, "config", "dice")).then(snap => {
      if (snap.exists()) {
        const data = snap.data();
        wCountInput.value = data.w || 1;
        xRangeInput.value = data.x || 6;
        hostTextArea.value = data.hostText || "";
      }
    });
  } else {
    hostPanel.style.display = "none";
  }
});

// ホストが設定を保存
saveConfigBtn.onclick = async () => {
  const w = Math.max(1, parseInt(wCountInput.value || "1"));
  const x = Math.max(1, parseInt(xRangeInput.value || "6"));
  const hostText = hostTextArea.value || "";
  await setDoc(doc(db, "config", "dice"), { w, x, hostText });
  alert("設定を保存しました");
};

// 履歴表示（ホストまたは全体、ルールで制御）
onSnapshot(collection(db, "logs"), snap => {
  logList.innerHTML = "";
  snap.forEach(d => {
    const li = document.createElement("li");
    li.textContent = new Date(d.data().time).toLocaleString() + " | " + d.data().result;
    logList.appendChild(li);
  });
});
