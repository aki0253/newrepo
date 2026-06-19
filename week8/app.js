import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  set,
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

console.info(
  "🚀 [TruthLens Initialize] Connecting to Firebase Realtime Database...",
);

const firebaseConfig = {
  apiKey: "AIzaSyAgKeo3jfIcWPqtUP8z1OZ-ttKKGFn6OWQ",
  authDomain: "truthlens-c145a.firebaseapp.com",
  databaseURL: "https://truthlens-c145a-default-rtdb.firebaseio.com",
  projectId: "truthlens-c145a",
  storageBucket: "truthlens-c145a.firebasestorage.app",
  messagingSenderId: "83433036103",
  appId: "1:83433036103:web:95edce094567bf150c5462",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
console.log(
  "✅ [Firebase Status] App and Database pipelines initialized successfully.",
);

const state = {
  currentLanguage: "en",
  seniorMode: false,
  largeText: false,
  currentUser: {
    name: "Guest User",
    email: "guest@truthlens.app",
    isAuthenticated: false,
  },
  guestScansRemaining: 10,
  cachedScans: {},
};

const dictionary = {
  en: {
    slogan: "Check Before You Believe.",
    signIn: "Sign In",
    register: "Create Account",
    continueGuest: "Continue as Guest",
    backToLogin: "Back to Sign In",
    submitRegistration: "Register Account",
    verifyVideo: "Verify Video",
    searchPlaceholder: "Paste YouTube URL or Search News",
    uploadScreenshot: "Screenshot",
    uploadVideo: "Video File",
    reportContent: "Report Content",
    recentChecks: "Timeline Logs",
    recentChecksTitle: "Recent Verification History",
    trustScore: "Trust Score Metric",
    aiRiskScore: "AI Risk Structural Breakdown",
    deepfake: "Deepfake Visual Likelihood",
    voiceCloning: "Synthetic Audio Footprint",
    generative: "Generative Probability Index",
    evidence: "Isolated Evidence Markers",
    explanation: "Explanation Panel",
    analyzeAnother: "Back to Home Feed",
    reportsTitle: "Reports History",
    reportsSubtitle: "Your recent analysis records stored on Firebase",
    settings: "Settings Configuration",
    seniorMode: "Senior Mode",
    largeText: "Large Text Size",
    logout: "Logout from Session",
    home: "Home",
    reports: "Reports",
    profile: "Profile",
    guestBannerText: "Guest Session: {count} verifications remaining.",
    guestLockedText:
      "Limit reached! Please register or sign in to scan more content.",
    avoidanceTipsTitle: "💡 Tips to Avoid This Manipulation",
  },
  np: {
    slogan: "विश्वास गर्नु अघि जाँच गर्नुहोस्।",
    signIn: "साइन इन",
    register: "नयाँ खाता बनाउनुहोस्",
    continueGuest: "अतिथि रूपमा जारी राख्नुहोस्",
    backToLogin: "साइन इनमा फर्कनुहोस्",
    submitRegistration: "दर्ता गर्नुहोस्",
    verifyVideo: "भिडियो प्रमाणित गर्नुहोस्",
    searchPlaceholder: "यूट्यूब लिङ्क वा समाचार राख्नुहोस्",
    uploadScreenshot: "स्क्रिनसट",
    uploadVideo: "भिडियो फाइल",
    reportContent: "रिपोर्ट गर्नुहोस्",
    recentChecks: "टाइमलाइन लग",
    recentChecksTitle: "भर्खरैको प्रमाणीकरण इतिहास",
    trustScore: "विश्वास स्कोर",
    aiRiskScore: "एआई जोखिम विश्लेषण",
    deepfake: "डीपफेक सम्भावना",
    voiceCloning: "एआई आवाज पहिचान",
    generative: "जेनेरेटिभ एआई सम्भावना",
    evidence: "संकलित प्रमाण विवरण",
    explanation: "सरल भाषामा व्याख्या",
    analyzeAnother: "गृहपृष्ठमा फर्कनुहोस्",
    reportsTitle: "रिपोर्ट इतिहास",
    reportsSubtitle:
      "तपाईंको डाटा क्लाउड डाटाबेसमा सुरक्षित रूपमा भण्डारण गरिएको छ",
    settings: "पहुँच योग्यता सेटिङहरू",
    seniorMode: "सिनियर मोड",
    largeText: "ठूलो अक्षरहरू",
    logout: "लगआउट",
    home: "गृहपृष्ठ",
    reports: "रिपोर्टहरू",
    profile: "प्रोफाइल",
    guestBannerText: "अतिथि सत्र: {count} जाँचहरू बाँकी छन्।",
    guestLockedText:
      "सीमा समाप्त! थप स्क्यान गर्न कृपया दर्ता वा साइन इन गर्नुहोस्।",
    avoidanceTipsTitle: "💡 यस प्रकारको भिडियोबाट बच्ने उपायहरू",
  },
};

const fallbackTips = {
  en: [
    "Check mouth coordination: Deepfakes exhibit mismatch sync between facial audio lines and speaker lip structures.",
    "Look for continuous blinking transitions: Synthetic profile tools often produce static tracking models around eyes.",
    "Cross-reference source indexes: Search established global wire services to view verified matches.",
  ],
  np: [
    "ओठको चाल ध्यान देकर हेर्नुहोस्: एआई भिडियोमा मानिसको आवाज र ओठको चाल मिल्दैन।",
    "आँखा झिम्क्याएको ढाँचा जाँच्नुहोस्: कृत्रिम रूपमा बनाइएका भिडियोहरूमा आँखाको चाल अस्वभाविक देखिन्छ।",
    "मुख्यधाराका समाचार माध्यममा खोजी गर्नुहोस्: आधिकारिक तथा स्थापित सञ्चार माध्यमहरूमा यो समाचार आएको छ कि छैन जाँच गर्नुहोस्।",
  ],
};

function navigateTo(targetScreenId) {
  console.log(
    `📌 [Navigation] Transitioning view window to: #${targetScreenId}`,
  );
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.add("hidden"));
  document.getElementById(targetScreenId).classList.remove("hidden");
  if (
    targetScreenId === "screen-login" ||
    targetScreenId === "screen-register"
  ) {
    document.getElementById("global-header").classList.add("hidden");
    document.getElementById("bottom-nav").classList.add("hidden");
  } else {
    document.getElementById("global-header").classList.remove("hidden");
    document.getElementById("bottom-nav").classList.remove("hidden");
    if (targetScreenId === "screen-dashboard") updateUsageBannerUI();
  }
}

function applyLocalization() {
  console.log(
    `🌐 [Localization] Applying system language packs: [${state.currentLanguage.toUpperCase()}]`,
  );
  const lang = state.currentLanguage;
  document.querySelectorAll("[data-key]").forEach((el) => {
    const key = el.getAttribute("data-key");
    if (dictionary[lang][key]) el.textContent = dictionary[lang][key];
  });
  document.querySelectorAll("[data-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-placeholder");
    if (dictionary[lang][key])
      el.setAttribute("placeholder", dictionary[lang][key]);
  });
  updateUsageBannerUI();
}

// Dynamically updates profile identifiers on the interface
function updateProfileUI() {
  const profileNameEl =
    document.querySelector("#screen-profile h3") ||
    document.querySelector("#screen-profile .profile-card h3") ||
    document.getElementById("profile-name-display");
  const profileEmailEl =
    document.querySelector("#screen-profile p") ||
    document.querySelector("#screen-profile .profile-card p") ||
    document.getElementById("profile-email-display");

  if (profileNameEl) profileNameEl.textContent = state.currentUser.name;
  if (profileEmailEl) profileEmailEl.textContent = state.currentUser.email;
  console.log(
    `👤 [UI Update] Profile text matching shifted to: ${state.currentUser.name}`,
  );
}

function updateUsageBannerUI() {
  const banner = document.getElementById("guest-usage-banner");
  const bannerText = document.getElementById("guest-banner-text");
  const inputField = document.getElementById("verification-input");
  const verifyBtn = document.getElementById("btn-verify");
  const lang = state.currentLanguage;

  if (state.currentUser.isAuthenticated) {
    banner.classList.add("hidden");
    inputField.disabled = false;
    verifyBtn.disabled = false;
    return;
  }
  banner.classList.remove("hidden");
  if (state.guestScansRemaining > 0) {
    banner.classList.remove("locked");
    bannerText.textContent = dictionary[lang].guestBannerText.replace(
      "{count}",
      state.guestScansRemaining,
    );
    inputField.disabled = false;
    verifyBtn.disabled = false;
  } else {
    console.warn(
      "⚠️ [Rate Limit] Guest scan balance exhausted. Verification terminal locked.",
    );
    banner.classList.add("locked");
    bannerText.textContent = dictionary[lang].guestLockedText;
    inputField.disabled = true;
    verifyBtn.disabled = true;
  }
}

function runAnalysisSimulation(inputUrl) {
  console.log(
    `🔍 [Verify Action] Processing target data payload from URL: "${inputUrl}"`,
  );
  if (!state.currentUser.isAuthenticated) {
    if (state.guestScansRemaining <= 0) {
      console.error(
        "❌ [Action Denied] Verification aborted: Rate limits active.",
      );
      return;
    }
    state.guestScansRemaining--;
  }

  const trustScore = Math.floor(Math.random() * 40) + 10;
  const deepfakeVal = Math.floor(Math.random() * 30) + 60;
  const voiceVal = Math.floor(Math.random() * 30) + 50;
  const generativeVal = Math.floor(Math.random() * 25) + 65;
  const aiRiskAvg = Math.floor((deepfakeVal + voiceVal + generativeVal) / 3);

  const payload = {
    url: inputUrl,
    timestamp: new Date().toLocaleDateString(),
    trustScore: trustScore,
    aiRiskScore: aiRiskAvg,
    deepfake: deepfakeVal,
    voice: voiceVal,
    generative: generativeVal,
    evidence: [
      "Visual artifacts identified along speaker perimeter margins.",
      "Synthetic sound cloning signatures matched with pre-trained audio sets.",
    ],
    metaTitle:
      "Scan Context: " +
      (inputUrl.includes("youtu")
        ? "https://youtu.be/Lp5x5WyALe0..."
        : inputUrl.substring(0, 20)),
  };

  console.log(
    "📡 [Firebase Push] Broadcasting simulated scan matrices payload:",
    payload,
  );

  push(ref(db, "scans/"), payload).then(() => {
    console.log(
      "💾 [Firebase Success] Document pushed and safely committed into DB reference keys.",
    );
    renderAnalysisTerminalView(payload, false);
    updateUsageBannerUI();
  });
}

function renderAnalysisTerminalView(data, showFullReport = false) {
  console.log(
    `📊 [Render View] Building interface card matrix. Configuration: [Deep Dive Details View = ${showFullReport}]`,
  );
  navigateTo("screen-results");

  document.getElementById("res-title").textContent = data.metaTitle;
  document.getElementById("res-meta").textContent =
    `${data.url.substring(0, 30)}... • ${data.timestamp}`;
  document.getElementById("trust-score-txt").textContent =
    `${data.trustScore}%`;

  const circumference = 2 * Math.PI * 60;
  const radialFill = document.getElementById("trust-radial-fill");
  radialFill.style.strokeDasharray = circumference;
  radialFill.style.strokeDashoffset =
    circumference - (data.trustScore / 100) * circumference;

  const statusLabel = document.getElementById("trust-status");
  if (data.trustScore > 65) {
    radialFill.style.stroke = "var(--state-success)";
    statusLabel.textContent = "TRUSTED";
    statusLabel.style.color = "var(--state-success)";
  } else if (data.trustScore > 45) {
    radialFill.style.stroke = "var(--state-warning)";
    statusLabel.textContent = "SUSPECT";
    statusLabel.style.color = "var(--state-warning)";
  } else {
    radialFill.style.stroke = "var(--state-alert)";
    statusLabel.textContent = "RISKY";
    statusLabel.style.color = "var(--state-alert)";
  }

  document.getElementById("bar-deepfake").style.width =
    `${data.deepfake || 0}%`;
  document.getElementById("bar-voice").style.width = `${data.voice || 0}%`;
  document.getElementById("bar-generative").style.width =
    `${data.generative || 0}%`;

  const reportDetailsContainer = document.getElementById(
    "hidden-report-details",
  );
  if (showFullReport) {
    reportDetailsContainer.classList.remove("hidden");

    const evidenceList = document.getElementById("evidence-list");
    evidenceList.innerHTML = "";
    (data.evidence || []).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      evidenceList.appendChild(li);
    });

    const tipsList = document.getElementById("tips-list");
    tipsList.innerHTML = "";
    (fallbackTips[state.currentLanguage] || fallbackTips["en"]).forEach(
      (tipStr) => {
        const li = document.createElement("li");
        li.textContent = tipStr;
        tipsList.appendChild(li);
      },
    );

    document.getElementById("explanation-text").textContent = state.seniorMode
      ? `Caution! High AI detection likelihood of ${data.aiRiskScore}%.`
      : `Verification audit calculated a trace density parameter matching ${data.aiRiskScore}% against adversarial networks.`;
  } else {
    reportDetailsContainer.classList.add("hidden");
  }
}

function generateHistoryCard(id, record) {
  const cardElement = document.createElement("div");
  cardElement.className = "history-item-card";

  const badgeColor =
    record.trustScore > 65
      ? "var(--state-success)"
      : record.trustScore > 45
        ? "var(--state-warning)"
        : "var(--state-alert)";
  const statusLabel =
    record.trustScore > 65
      ? "Verified"
      : record.trustScore > 45
        ? "Suspect"
        : "Risky";

  cardElement.innerHTML = `
        <div class="history-meta-row">
            <strong style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 70%;">${record.metaTitle}</strong>
            <span class="badge-pill" style="background:${badgeColor}; color:#0A0F1D;">${statusLabel}</span>
        </div>
        <span class="subtext">Checked: ${record.timestamp}</span>
        <div style="display:flex; gap:12px; font-size:0.8rem; font-weight:700; color:var(--color-interactive); margin-top:2px;">
            <span>Trust Factor: ${record.trustScore}%</span>
            <span style="color:var(--text-muted)">|</span>
            <span>AI Risk Index: ${record.aiRiskScore}%</span>
        </div>
    `;

  cardElement.addEventListener("click", () => {
    console.log(`📂 [Report Deep-Dive] User opened snapshot ID: ${id}`);
    const matchedPayload = state.cachedScans[id];
    if (matchedPayload) renderAnalysisTerminalView(matchedPayload, true);
  });
  return cardElement;
}

function initFirebaseFeedListeners() {
  console.log(
    "📥 [Firebase Listeners] Establishing live stream synchronization pipes...",
  );
  onValue(ref(db, "scans/"), (snapshot) => {
    const recordsRawData = snapshot.val();
    console.log(
      "♻️ [Data Sync] Local caching node updated via remote entry change context:",
      recordsRawData,
    );

    const dashboardFeed = document.getElementById("dashboard-recent-feed");
    const historyListFeed = document.getElementById("history-list-feed");
    dashboardFeed.innerHTML = "";
    historyListFeed.innerHTML = "";
    if (!recordsRawData) return;

    state.cachedScans = recordsRawData;
    Object.entries(recordsRawData)
      .reverse()
      .forEach(([key, record]) => {
        dashboardFeed.appendChild(generateHistoryCard(key, record));
        historyListFeed.appendChild(generateHistoryCard(key, record));
      });
  });
}

// UI Triggers Setup Tracking Logs
document
  .getElementById("btn-execute-register")
  .addEventListener("click", () => {
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    if (!name || !email || !password) return;
    const sanitizedKey = email.replace(/[.#$\[\]]/g, "_");

    console.log(`👤 [Auth Request] Running registration submission: ${email}`);
    set(ref(db, "users/" + sanitizedKey), { name, email, password }).then(
      () => {
        state.currentUser = { name, email, isAuthenticated: true };
        updateProfileUI();
        navigateTo("screen-dashboard");
      },
    );
  });

document.getElementById("btn-signin").addEventListener("click", () => {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  if (!email || !password) return;
  const sanitizedKey = email.replace(/[.#$\[\]]/g, "_");

  console.log(
    `🔑 [Auth Request] Checking authentication credentials sequence for: ${email}`,
  );
  onValue(
    ref(db, "users/" + sanitizedKey),
    (snapshot) => {
      const userData = snapshot.val();
      if (userData && userData.password === password) {
        console.log(
          `🔓 [Auth Success] Matches confirmed. Welcome back, ${userData.name}`,
        );
        state.currentUser = {
          name: userData.name,
          email: userData.email,
          isAuthenticated: true,
        };
        updateProfileUI();
        navigateTo("screen-dashboard");
      } else {
        console.error(
          "🔒 [Auth Failed] Invalid email string or unverified security handshake parameters.",
        );
      }
    },
    { onlyOnce: true },
  );
});

document
  .getElementById("btn-goto-register")
  .addEventListener("click", () => navigateTo("screen-register"));
document
  .getElementById("btn-back-to-login")
  .addEventListener("click", () => navigateTo("screen-login"));
document.getElementById("btn-guest").addEventListener("click", () => {
  console.log(
    "ℹ️ [Auth Session] Initiated sandbox guest profile runtime sequence.",
  );
  state.currentUser = {
    name: "Guest User",
    email: "guest@truthlens.app",
    isAuthenticated: false,
  };
  updateProfileUI();
  navigateTo("screen-dashboard");
});
document
  .getElementById("btn-res-back")
  .addEventListener("click", () => navigateTo("screen-dashboard"));
document.getElementById("btn-logout").addEventListener("click", () => {
  state.currentUser = {
    name: "Guest User",
    email: "guest@truthlens.app",
    isAuthenticated: false,
  };
  console.log("👋 [Session Terminated] User logged out.");
  updateProfileUI();
  navigateTo("screen-login");
});

document.getElementById("btn-verify").addEventListener("click", () => {
  const inputElementUrl = document.getElementById("verification-input");
  if (inputElementUrl.value.trim() !== "") {
    runAnalysisSimulation(inputElementUrl.value.trim());
    inputElementUrl.value = "";
  }
});

document.getElementById("language-switcher").addEventListener("change", (e) => {
  state.currentLanguage = e.target.value;
  applyLocalization();
});

document
  .getElementById("toggle-senior-mode")
  .addEventListener("change", (e) => {
    state.seniorMode = e.target.checked;
    console.log(
      `⚙️ [Config Override] Senior Mode visibility state = ${state.seniorMode}`,
    );
    document.body.classList.toggle("senior-mode", state.seniorMode);
  });

document.getElementById("toggle-large-text").addEventListener("change", (e) => {
  state.largeText = e.target.checked;
  console.log(
    `⚙️ [Config Override] Large Text baseline factor state = ${state.largeText}`,
  );
  document.body.classList.toggle("large-text-mode", state.largeText);
});

document.querySelectorAll(".nav-item").forEach((tabItem) => {
  tabItem.addEventListener("click", () => {
    document
      .querySelectorAll(".nav-item")
      .forEach((i) => i.classList.remove("active"));
    tabItem.classList.add("active");
    navigateTo(tabItem.getAttribute("data-target"));
  });
});

applyLocalization();
updateProfileUI();
initFirebaseFeedListeners();
