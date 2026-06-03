const questions = document.querySelectorAll(".question-rotator span");
let activeQuestion = 0;

function rotateQuestion() {
  questions.forEach((question, index) => {
    question.classList.toggle("active", index === activeQuestion);
  });
  activeQuestion = (activeQuestion + 1) % questions.length;
}

rotateQuestion();
setInterval(rotateQuestion, 2400);

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
