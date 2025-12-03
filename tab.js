import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, addDoc, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const app = initializeApp({ あなたのキー });
const db = getFirestore(app);
const auth = getAuth(app);

const rollBtn = document.getElementById("rollBtn");
const fixed = document.getElementById("fixedResult");

async function rollDice() {
  const configSnap = await getDoc(doc(db, "config", "dice"));
  const config = configSnap.data();

  let result = "";
  for (let i = 0; i < config.w; i++) {
    const r = Math.floor(Math.random() * config.x) + 1;
    result += `${String.fromCharCode(119+i)}:${r} `;
  }

  fixed.textContent = result;

  await addDoc(collection(db, "logs"), {
    result,
    time: Date.now()
  });
}

rollBtn.onclick = rollDice;
rollDice(); // 入室時に自動ロール

// ホスト判定
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("hostPanel").style.display = "block";
  }
});

// ログ監視
onSnapshot(collection(db, "logs"), snap => {
  const ul = document.getElementById("logList");
  ul.innerHTML = "";
  snap.forEach(d => {
    const li = document.createElement("li");
    li.textContent = new Date(d.data().time).toLocaleString() + " " + d.data().result;
    ul.appendChild(li);
  });
});
