const questions = document.querySelectorAll(".question-rotator span");
let activeQuestion = 0;

function rotateQuestion() {
  questions.forEach((question, index) => {
    question.classList.toggle("active", index === activeQuestion);
  });
  activeQuestion = (activeQuestion + 1) % questions.length;
}

if (questions.length) {
  rotateQuestion();
  setInterval(rotateQuestion, 2400);
}

const episodeCards = document.querySelectorAll(".episode-card");
const episodes = document.querySelectorAll(".chapter-panel");

episodeCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    const target = document.querySelector(card.getAttribute("href"));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", card.getAttribute("href"));
    }
    episodeCards.forEach((item) => item.classList.toggle("active", item === card));
  });
});

if ("IntersectionObserver" in window) {
  const episodeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        episodeCards.forEach((card) => {
          card.classList.toggle("active", card.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
  );

  episodes.forEach((episode) => episodeObserver.observe(episode));
}

function dateOnly(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getEasterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

function getAdventStart(year) {
  const decemberThird = new Date(year, 11, 3);
  return addDays(decemberThird, -decemberThird.getDay());
}

function getLiturgicalSeason(today = new Date()) {
  const current = dateOnly(today);
  const year = current.getFullYear();
  const easter = getEasterDate(year);
  const ashWednesday = addDays(easter, -46);
  const easterSeasonEnd = addDays(easter, 49);
  const adventStart = getAdventStart(year);
  const christmasStart = new Date(year, 11, 25);
  const christmasEnd = new Date(year + 1, 0, 6);
  const earlyChristmasEnd = new Date(year, 0, 6);

  if (current >= adventStart && current < christmasStart) {
    return {
      season: "Advent",
      description: "Advent trains expectation. The Church waits for Christ's coming in history, in glory, and into the ordinary places where people still need hope."
    };
  }
  if ((current >= christmasStart && current <= christmasEnd) || current <= earlyChristmasEnd) {
    return {
      season: "Christmas",
      description: "Christmas is not only a day. It is the Church lingering over the claim that God entered the world in flesh, poverty, family, and vulnerability."
    };
  }
  if (current >= ashWednesday && current < easter) {
    return {
      season: "Lent",
      description: "Lent strips faith back to essentials: repentance, fasting, prayer, mercy, and the long walk with Christ toward the Cross."
    };
  }
  if (current >= easter && current <= easterSeasonEnd) {
    return {
      season: "Easter",
      description: "Easter is the Church's great season of resurrection. The point is not optimism, but Christ risen after real death."
    };
  }
  return {
    season: "Ordinary Time",
    description: "Ordinary Time is not filler. It is the long school of discipleship, where the life of Christ is learned in ordinary weeks."
  };
}

const liturgicalDay = document.querySelector("#liturgical-day");
const liturgicalSeason = document.querySelector("#liturgical-season");
const liturgicalDescription = document.querySelector("#liturgical-description");
if (liturgicalSeason && liturgicalDescription) {
  const today = new Date();
  const currentSeason = getLiturgicalSeason(today);
  if (liturgicalDay) {
    liturgicalDay.textContent = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    }).format(today);
  }
  liturgicalSeason.textContent = currentSeason.season;
  liturgicalDescription.textContent = currentSeason.description;
}

const churchSpaceText = {
  altar: {
    label: "Altar",
    title: "The table of sacrifice and communion",
    copy: "The altar is where the Eucharistic sacrifice is offered and the faithful are fed. Its central placement tells the eye that Catholic worship turns around Christ's self-gift."
  },
  ambo: {
    label: "Ambo",
    title: "The place where Scripture is proclaimed",
    copy: "The ambo gives the Word a visible home. Catholic worship does not treat Scripture as background; it is proclaimed as living address to the gathered Church."
  },
  tabernacle: {
    label: "Tabernacle",
    title: "The reserved Eucharistic presence",
    copy: "The tabernacle holds the consecrated Eucharist outside Mass, especially for the sick and for prayer. Its lamp quietly signals Christ's sacramental presence."
  },
  font: {
    label: "Baptismal Font",
    title: "The doorway into Christian life",
    copy: "The font points to baptism: cleansing, rebirth, and entry into the Church. Many churches place it near the entrance because baptism is the beginning."
  },
  crucifix: {
    label: "Crucifix",
    title: "Love shown through the Cross",
    copy: "The crucifix keeps Christian faith from becoming vague uplift. Catholic worship looks at Christ's wounded love and reads every hope through it."
  },
  candles: {
    label: "Candles",
    title: "Prayer, vigil, and living light",
    copy: "Candles make prayer visible. Their flame suggests watchfulness, offering, memory, and the light of Christ held in a dark world."
  }
};

const churchDetail = document.querySelector("#church-detail");
document.querySelectorAll("[data-church-space]").forEach((button) => {
  const updateChurchSpace = () => {
    const detail = churchSpaceText[button.dataset.churchSpace];
    if (!detail || !churchDetail) return;
    document.querySelectorAll("[data-church-space]").forEach((item) => {
      item.classList.toggle("active", item === button);
    });
    churchDetail.innerHTML = `<p class="eyebrow">${detail.label}</p><h3>${detail.title}</h3><p>${detail.copy}</p>`;
  };
  button.addEventListener("click", updateChurchSpace);
  button.addEventListener("mouseenter", updateChurchSpace);
});

const massStageKicker = document.querySelector("#mass-stage-kicker");
const massStageTitle = document.querySelector("#mass-stage-title");
const massStageCopy = document.querySelector("#mass-stage-copy");
const massFlowSteps = document.querySelectorAll("[data-mass-phase]");

function setMassStage(step) {
  if (!step || !massStageTitle || !massStageCopy) return;
  massFlowSteps.forEach((item) => item.classList.toggle("active", item === step));
  if (massStageKicker) massStageKicker.textContent = step.dataset.massPhase;
  massStageTitle.textContent = step.dataset.massTitle;
  massStageCopy.textContent = step.dataset.massCopy;
}

if ("IntersectionObserver" in window && massFlowSteps.length) {
  const massObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setMassStage(entry.target);
      });
    },
    { rootMargin: "-35% 0px -45% 0px", threshold: 0.2 }
  );
  massFlowSteps.forEach((step) => massObserver.observe(step));
}

const toast = document.querySelector(".toast");
let toastTimer;

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 4200);
}

const beliefText = {
  God: "Catholicism begins with God as personal, creative, and loving, not a vague force.",
  Trinity: "The Trinity names one God in three persons: Father, Son, and Holy Spirit.",
  Jesus: "Catholics believe Jesus is fully God and fully human, the center of the faith.",
  Grace: "Grace is God acting first, drawing human beings into healing and communion.",
  Sacraments: "Sacraments are visible signs through which Catholics believe God gives grace.",
  Heaven: "Heaven is communion with God, not merely a pleasant afterlife."
};

document.querySelectorAll("[data-belief]").forEach((button) => {
  button.addEventListener("click", () => showToast(beliefText[button.dataset.belief]));
});

document.querySelectorAll("[data-myth]").forEach((button) => {
  button.addEventListener("click", () => showToast(button.dataset.myth));
});

document.querySelectorAll("[data-check]").forEach((button) => {
  button.addEventListener("click", () => showToast(button.dataset.check));
});

document.querySelectorAll(".filter-row button, .country-list button").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(`${button.textContent.trim()} selected. In the full build, this opens a focused learning page.`);
  });
});

const beliefDetail = document.querySelector("#belief-detail");

document.querySelectorAll(".belief-tile-large:not(.myth-tile-large)").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".belief-tile-large:not(.myth-tile-large)").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    if (beliefDetail) beliefDetail.textContent = button.dataset.detail;
  });
  button.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    button.click();
  });
});

const mythDetail = document.querySelector("#myth-detail");

document.querySelectorAll(".myth-tile-large").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".myth-tile-large").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    if (mythDetail) mythDetail.textContent = button.dataset.detail;
  });
  button.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    button.click();
  });
});

const sacramentDetails = [
  ["Baptism", "The gateway. Through water and Spirit, a person is born again and united to Christ's death and resurrection."],
  ["Confirmation", "The strengthening of baptismal grace through the Holy Spirit. The believer is sealed and sent."],
  ["Eucharist", "The source and summit. Catholics believe the bread and wine genuinely become the Body and Blood of Christ: the Real Presence."],
  ["Reconciliation", "The sacrament of forgiveness. Through the ministry of a priest, God's forgiveness is made personal, audible, and certain."],
  ["Anointing of the Sick", "A grace for those seriously ill or near death: strength, peace, and sometimes physical healing."],
  ["Matrimony", "Marriage as sacrament: a permanent, exclusive covenant that images Christ's love for the Church."],
  ["Holy Orders", "The ordination of bishops, priests, and deacons, set apart to lead, teach, and serve."]
];

const sacramentDetail = document.querySelector("#sacrament-detail");

document.querySelectorAll("[data-step]").forEach((button) => {
  button.addEventListener("click", () => {
    const detail = sacramentDetails[Number(button.dataset.step)];
    document.querySelectorAll("[data-step]").forEach((item) => item.classList.toggle("active", item === button));
    if (sacramentDetail && detail) {
      sacramentDetail.innerHTML = `<h3>${detail[0]}</h3><p>${detail[1]}</p>`;
    }
  });
});

document.querySelectorAll(".quiz button").forEach((button) => {
  button.addEventListener("click", () => {
    const quiz = button.closest(".quiz");
    const result = document.querySelector("#quiz-result");
    quiz.querySelectorAll("button").forEach((item) => {
      item.classList.remove("correct", "incorrect");
    });
    const isCorrect = button.dataset.correct === "true";
    button.classList.add(isCorrect ? "correct" : "incorrect");
    if (result) {
      result.textContent = isCorrect
        ? quiz.dataset.correctMessage ||
          "Correct. Catholic teaching is unambiguous: salvation is God's free gift. Good works are the fruit of grace received, not its replacement."
        : quiz.dataset.incorrectMessage ||
          "Not quite. Catholic teaching says grace comes first. Humans cooperate with grace, but do not earn it.";
    }
  });
});

document.querySelectorAll("[data-save-reflection]").forEach((button) => {
  const id = button.dataset.saveReflection;
  const textarea = document.querySelector(`#${id}`);
  const state = document.querySelector(`#${id}-state`);
  if (textarea) textarea.value = localStorage.getItem(id) || "";
  button.addEventListener("click", () => {
    localStorage.setItem(id, textarea.value);
    if (state) state.textContent = "Saved";
  });
});

document.querySelectorAll(".deep-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const body = button.nextElementSibling;
    const open = body.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });
});

const siteHeader = document.querySelector(".site-header");
if (siteHeader) {
  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      siteHeader.classList.add("header-hidden");
    } else {
      siteHeader.classList.remove("header-hidden");
    }
    lastScrollY = currentScrollY;
  }, { passive: true });
}

if ("IntersectionObserver" in window) {
  const lessonLinks = document.querySelectorAll(".lesson-rail a");
  const lessonSections = document.querySelectorAll(".lesson-section[id]");
  const lessonObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        lessonLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: 0.01 }
  );
  lessonSections.forEach((section) => lessonObserver.observe(section));
}

const gospelTarget = document.querySelector("#daily-gospel");
const usccbRssUrl = "https://bible.usccb.org/readings/rss";

function getUsccbReadingUrl(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `https://bible.usccb.org/bible/readings/${month}${day}${year}.cfm`;
}

const usccbReadingUrl = getUsccbReadingUrl();

function decodeHtml(value) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function htmlToReadableText(html) {
  return decodeHtml(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/h[1-6]>/gi, "\n")
      .replace(/<[^>]*>/g, "")
  )
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractGospel(text) {
  const allLines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const headingIndex = allLines.findIndex((line) => line.toLowerCase() === "gospel");
  if (headingIndex < 0) return null;

  const lines = [];
  for (const line of allLines.slice(headingIndex + 1)) {
    if (/^(Readings for|Lectionary for Mass|Copyright|Daily Reading|LISTEN PODCAST|VIEW REFLECTION VIDEO|En Español|View Calendar|Get Daily Readings)/i.test(line)) {
      break;
    }
    lines.push(line);
  }

  const reference = lines.shift() || "Gospel";
  const body = lines.join("\n").trim();

  if (!body) return null;
  return { reference, body };
}

function renderGospel({ title, date, reference, body, link }) {
  if (!gospelTarget) return;
  const paragraphs = body.split(/\n{2,}/).filter(Boolean);
  gospelTarget.innerHTML = `
    <p class="reading-date">${date || "Today's reading"}</p>
    <h4>${reference}</h4>
    <div class="gospel-text"></div>
    <a class="reader-source" href="${link || usccbReadingUrl}" target="_blank" rel="noreferrer">Read the full daily readings</a>
  `;

  const textWrap = gospelTarget.querySelector(".gospel-text");
  paragraphs.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    textWrap.appendChild(p);
  });

  if (title) {
    const dateLine = gospelTarget.querySelector(".reading-date");
    dateLine.textContent = title;
  }
}

function renderGospelFallback() {
  if (!gospelTarget) return;
  gospelTarget.innerHTML = `
    <p class="reading-date">${new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(new Date())}</p>
    <h4>Today's USCCB Gospel</h4>
    <p class="reading-status">Your browser blocked the text import, so the official USCCB reading page is shown here directly.</p>
    <iframe class="gospel-frame" title="USCCB daily readings" src="${usccbReadingUrl}"></iframe>
    <a class="reader-source" href="${usccbReadingUrl}" target="_blank" rel="noreferrer">Open today's USCCB readings</a>
  `;
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Reading request failed: ${response.status}`);
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const data = await response.json();
    return data.contents || data.content || "";
  }
  return response.text();
}

async function loadDailyGospel() {
  if (!gospelTarget) return;
  const proxiedReadingJson = `https://api.allorigins.win/get?url=${encodeURIComponent(usccbReadingUrl)}`;
  const proxiedReading = `https://api.allorigins.win/raw?url=${encodeURIComponent(usccbReadingUrl)}`;
  const proxiedRssJson = `https://api.allorigins.win/get?url=${encodeURIComponent(usccbRssUrl)}`;
  const proxiedRss = `https://api.allorigins.win/raw?url=${encodeURIComponent(usccbRssUrl)}`;
  const sources = [usccbReadingUrl, proxiedReadingJson, proxiedReading, usccbRssUrl, proxiedRssJson, proxiedRss];

  for (const source of sources) {
    try {
      const text = await fetchText(source);
      const xml = new DOMParser().parseFromString(text, "application/xml");
      const item = xml.querySelector("item");

      if (item) {
        const title = item.querySelector("title")?.textContent?.trim();
        const link = item.querySelector("link")?.textContent?.trim();
        const description = item.querySelector("description")?.textContent || text;
        const gospel = extractGospel(htmlToReadableText(description));
        if (gospel) {
          renderGospel({ title, reference: gospel.reference, body: gospel.body, link });
          return;
        }
      }

      const pageText = htmlToReadableText(text);
      const gospel = extractGospel(pageText);
      if (gospel) {
        renderGospel({
          title: new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(new Date()),
          reference: gospel.reference,
          body: gospel.body,
          link: usccbReadingUrl
        });
        return;
      }
    } catch (error) {
      console.warn(error);
    }
  }

  renderGospelFallback();
}

const lectioSteps = [
  {
    title: "Lectio: Read",
    copy: "Read the Gospel slowly. Notice one word, image, command, or question that seems to stay with you.",
    prompt: "What word or phrase is drawing your attention?"
  },
  {
    title: "Meditatio: Meditate",
    copy: "Let that word or phrase meet your actual life. Stay with it without forcing a conclusion.",
    prompt: "Where does this Gospel touch your life today?"
  },
  {
    title: "Oratio: Pray",
    copy: "Speak honestly to God from what surfaced. Ask, thank, confess, or simply name what is true.",
    prompt: "What prayer rises from this reading?"
  },
  {
    title: "Contemplatio: Rest",
    copy: "Let the words fall quiet. Rest in God's presence before trying to do anything with the reading.",
    prompt: "What is it like to sit with God here?"
  },
  {
    title: "Actio: Live",
    copy: "Choose one small, concrete response for the next few hours. Let the Gospel become practice.",
    prompt: "What one action will you carry into today?"
  }
];

let activeLectioStep = 0;

function lectioKey(step = activeLectioStep) {
  const today = new Date().toISOString().slice(0, 10);
  return `reason-roots-lectio-${today}-${step}`;
}

function saveLectioNote() {
  const note = document.querySelector("#lectio-note");
  const state = document.querySelector("#lectio-save-state");
  if (!note) return;
  localStorage.setItem(lectioKey(), note.value);
  if (state) state.textContent = "Saved";
}

function showLectioStep(step, shouldSave = true) {
  if (shouldSave) saveLectioNote();
  activeLectioStep = Math.max(0, Math.min(step, lectioSteps.length - 1));
  const data = lectioSteps[activeLectioStep];
  document.querySelectorAll("[data-lectio-step]").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.lectioStep) === activeLectioStep);
  });
  const kicker = document.querySelector("#lectio-kicker");
  const title = document.querySelector("#lectio-step-title");
  const copy = document.querySelector("#lectio-step-copy");
  const label = document.querySelector("#lectio-note-label");
  const note = document.querySelector("#lectio-note");
  const state = document.querySelector("#lectio-save-state");
  if (kicker) kicker.textContent = `Step ${activeLectioStep + 1} of ${lectioSteps.length}`;
  if (title) title.textContent = data.title;
  if (copy) copy.textContent = data.copy;
  if (label) label.textContent = data.prompt;
  if (note) note.value = localStorage.getItem(lectioKey()) || "";
  if (state) state.textContent = "";
}

document.querySelectorAll("[data-lectio-step]").forEach((button) => {
  button.addEventListener("click", () => showLectioStep(Number(button.dataset.lectioStep)));
});

document.querySelector("[data-next-lectio]")?.addEventListener("click", () => {
  showLectioStep(activeLectioStep + 1 >= lectioSteps.length ? 0 : activeLectioStep + 1);
});

document.querySelector("[data-save-lectio]")?.addEventListener("click", saveLectioNote);

document.querySelector("[data-reset-lectio]")?.addEventListener("click", () => {
  lectioSteps.forEach((_, index) => localStorage.removeItem(lectioKey(index)));
  showLectioStep(0);
});

showLectioStep(0, false);
loadDailyGospel();
