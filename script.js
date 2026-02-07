/* =========================================================
 Valentine Site (3 screens)
 - Unlock -> Letter -> Ask
 - No top tabs/dots
 - No skip, no hash route, no localStorage bypass
 - Envelope must be opened to Continue
 - 8 notes only; after 8 it stops and teases 😈
========================================================= */
const $ = (sel) => document.querySelector(sel);
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function shake(el) {
  if (!el || !el.animate) return;
  el.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-6px)" },
      { transform: "translateX(6px)" },
      { transform: "translateX(0)" },
    ],
    { duration: 220, iterations: 1 }
  );
}

function popHeart(x, y) {
  const h = document.createElement("div");
  h.textContent = Math.random() < 0.25 ? "💗" : "💖";
  h.style.position = "fixed";
  h.style.left = `${x}px`;
  h.style.top = `${y}px`;
  h.style.transform = `translate(-50%, -50%) scale(${0.9 + Math.random() * 0.6})`;
  h.style.fontSize = `${18 + Math.random() * 18}px`;
  h.style.pointerEvents = "none";
  h.style.zIndex = 5;
  h.style.transition = "transform .9s ease, opacity .9s ease";
  document.body.appendChild(h);
  requestAnimationFrame(() => {
    h.style.opacity = "0";
    h.style.transform = `translate(-50%, -120px) scale(${0.7 + Math.random() * 0.6})`;
  });
  setTimeout(() => h.remove(), 900);
}

/* -------------------------
 Screens (hard no skipping)
------------------------- */
const screens = {
  lock: $("#screen-lock"),
  letter: $("#screen-letter"),
  ask: $("#screen-ask"),
};

let unlocked = false;

function showOnly(name){
  Object.entries(screens).forEach(([k, el]) => {
    if (el) el.hidden = (k !== name);
  });
  // wipe hash so deep-links don't work
  history.replaceState(null, "", location.pathname + location.search);
}

function go(name){
  if (!unlocked && name !== "lock") {
    showOnly("lock");
    return;
  }
  showOnly(name);
}

// Always start locked
showOnly("lock");

/* -------------------------
 Unlock screen
------------------------- */
const codeInput = $("#codeInput");
const unlockBtn = $("#unlockBtn");
const lockMsg = $("#lockMsg");

const SECRET = "Sammie";

function unlock() {
  const attempt = (codeInput?.value || "").trim().toLowerCase();

  if (!attempt) {
    lockMsg.textContent = "Type something first";
    shake(screens.lock);
    return;
  }

  if (attempt === SECRET.toLowerCase()) {
    unlocked = true;
    lockMsg.textContent = "Unlocked! ⋆˙⟡♡ Proceeding…";
    setTimeout(() => go("letter"), 250);
  } else {
    lockMsg.textContent = "Hint: I love a girl named? (ur nickname, babe)";
    shake(screens.lock);
  }
}

unlockBtn?.addEventListener("click", unlock);
codeInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") unlock();
});

/* -------------------------
 Letter screen (envelope must open)
------------------------- */
const envelope = $("#envelope");
const typedLetter = $("#typedLetter");
const retypeBtn = $("#retypeBtn");
const nextToAskBtn = $("#nextToAskBtn");

$("#toName").textContent = "Sammie";
$("#fromName").textContent = "your An";

const LETTER_TEXT =
  "Hi Sam.\n\n" +
  "Just a reminder:\n" +
  "Thank you for having me as your partner.\n" +
  "I’m proud of you and I'm so lucky.\n" +
  "That you like me and I like you… a LOT.\n" +
  "I miss you too.\n\n" +
  "You know, liking you and taking the risk was worht it.\n" +
  "I literally start to imagine myself better for you.\n" +
  "That's the imapct you have given to me, thats why.\n" +
  "I want to make you happy and laugh more.\n\n" +
  "Thank you being the lover that I thought the world cannot afford to give me.\n" +
  "You are important to me, more than you know.\n\n" +
  "Now… I have a question  (｡•́   ̫ •̀｡)";

let typingTimer = null;
let letterOpened = false;

function typeText(el, text, speed = 22) {
  if (!el) return;
  clearInterval(typingTimer);
  el.textContent = "";
  let i = 0;
  typingTimer = setInterval(() => {
    el.textContent += text[i] ?? "";
    i++;
    if (i >= text.length) {
      clearInterval(typingTimer);
      typingTimer = null;
    }
  }, speed);
}

function openEnvelope() {
  if (!envelope) return;

  // Toggle open so it feels clickable every time
  envelope.classList.toggle("open");

  const rect = envelope.getBoundingClientRect();
  for (let i = 0; i < 8; i++) {
    setTimeout(() => popHeart(
      rect.left + rect.width * 0.5 + (Math.random() * 80 - 40),
      rect.top + rect.height * 0.45 + (Math.random() * 60 - 30)
    ), i * 35);
  }

  // When opened the first time, enable continue and type the letter
  if (envelope.classList.contains("open")) {
    if (!letterOpened) {
      letterOpened = true;
      nextToAskBtn.disabled = false;
    }
    typeText(typedLetter, LETTER_TEXT);
  }
}

// ✅ This is what makes the envelope clickable
envelope?.addEventListener("click", openEnvelope);
envelope?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") openEnvelope();
});

retypeBtn?.addEventListener("click", () => {
  // Force it open + retype
  envelope?.classList?.add("open");
  if (!letterOpened) {
    letterOpened = true;
    nextToAskBtn.disabled = false;
  }
  typeText(typedLetter, LETTER_TEXT);
});

nextToAskBtn?.addEventListener("click", () => {
  if (!letterOpened) return;
  go("ask");
});

/* -------------------------
 ASK: 8 notes stop + jar fill
------------------------- */
const yesBtn = $("#yes");
const arena = $("#arena");
const noteText = $("#noteText");
const noteCount = $("#noteCount");
const ask2Sub = $("#ask2Sub");
const final = $("#final");
const replayBtn = $("#replayBtn");
const copyLinkBtn = $("#copyLinkBtn");

let yesClicks = 0;
let finalShown = false;

const NOTES = [
  "You're one of the reason why I dream of a future (˶ˆᗜˆ˵).",
  "Your presence are enough for me, like an energy drink that keeps me going.",
  "You look cute, pretty and gorgeous that my type is 'YOU'",
  "You sound like one of my favorite songs ▶︎•၊၊||၊|။|||||။၊|။•.",
  "You made me feel shy because I... I am your girlfriend.",
  " ( •̀ - • ) You look both ways before crossing my mind?",
  "You... you... (>/////<  ) really like me back?",
  "You will be my valentines forever, it's your obligation now ᗜ⩊ᗜ",
];

function popNote(text){
  if(!noteText) return;
  noteText.classList.remove("notePop");
  noteText.textContent = text;
  void noteText.offsetWidth;
  noteText.classList.add("notePop");
}

function setYesScale(scale){
  yesBtn.style.setProperty("--yesScale", String(scale));
}

function setFillLevel(v){
  if(!arena) return;
  arena.style.setProperty("--fill", String(clamp(v, 0, 1)));
}

function confettiPop(){
  if(typeof window.confetti === "function"){
    window.confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.75 },
      disableForReducedMotion: true
    });
  }
}

function showFinal(){
  if(finalShown) return;
  finalShown = true;
  if(final) final.hidden = false;
  confettiPop();

  finalMsg.textContent = "Screenshot this and send it to me (ᵕ—ᴗ—)";
``
}

function updateYes(){
  if(yesClicks > 0){
    const idx = Math.min(yesClicks - 1, NOTES.length - 1);
    popNote(NOTES[idx]);
    if(noteCount) noteCount.textContent = String(yesClicks);
  }

  const progress = Math.min(yesClicks / NOTES.length, 1);
  const eased = 1 - Math.pow(1 - progress, 2);
  setFillLevel(eased);

  let scale = 0.9 + yesClicks * 0.18;

  if(arena && yesBtn){
    const a = arena.getBoundingClientRect();
    const b = yesBtn.getBoundingClientRect();
    const targetScaleX = (a.width * 0.92) / b.width;
    const targetScaleY = (a.height * 0.72) / b.height;
    const jarFillScale = Math.min(targetScaleX, targetScaleY);

    if(yesClicks >= NOTES.length){
      scale = jarFillScale;
      setFillLevel(1);
      if(ask2Sub) ask2Sub.textContent = "You can read those again. I hope it makes smile";
      showFinal();
    } else {
      scale = Math.min(scale, jarFillScale * 0.92);
    }
  }

  setYesScale(scale);
}

function resetAsk(){
  yesClicks = 0;
  finalShown = false;
  if(final) final.hidden = true;
  if(noteCount) noteCount.textContent = "0";
  if(ask2Sub) ask2Sub.textContent = "Tap “Yes” to agree with consent";
  popNote("(Tap “Yes” to start)");
  setYesScale(0.9);
  setFillLevel(0);
}

yesBtn?.addEventListener("click", () => {
  if (yesClicks >= NOTES.length) {
    popNote("That's a yes, more yes means you like me that much!");
    if(ask2Sub) ask2Sub.textContent = "Still tapping? I'm getting shy (///▽///)";
    confettiPop();
    return;
  }
  yesClicks++;
  updateYes();
});

replayBtn?.addEventListener("click", resetAsk);


window.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  if(k === "r") resetAsk();
});

// init

resetAsk();

