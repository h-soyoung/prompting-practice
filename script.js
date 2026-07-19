const storyStates = [
  {
    tag: "FrutigerAero",
    items: [
      ["ahoon_2000", "c0a9be8637a93ba46edba1c7268c5802ed91f772.png", 0, 599],
      ["kobayashi", "cc546f8a5ff357598c837b90983cc7633ca9e110.png", 599, 272],
      ["norgira.2026", "b6893c3b67a4aab7e009a0e20773c786863d8b67.png", 871, 555],
      ["gen_x_ero", "f1818104eb1dc276a11421eb1948dbfca873f5bd.png", 1426, 543, "fill"],
    ],
  },
  {
    tag: "CleanGirl",
    items: [
      ["dallaba", "5814d583aa380f7bc312347c242c6c81a23104b0.png", 0, 422],
      ["Mini_ji", "23f9bbd595b71a90a41a4d871b6fdf22957669b8.png", 422, 368],
      ["___Juju___", "b203252507513e641f3f78ea2f2a454e221e2720.png", 790, 555],
      ["bandikim", "bd4cd134990beb853f82c3642657437962ed892c.png", 1345, 253],
      ["Jinjilly", "a8065586bff204523bc5ab8092d70bd0357e2557.png", 1598, 337],
    ],
  },
  {
    tag: "VisualKei",
    items: [
      ["wooinkann", "206fe6a69d1dee0d2e665f2bff9f02a1346594a8.png", 0, 480],
      ["jane.doe_372", "28a7edc179f6fe8e2fe4755fab507fc1851a059d.png", 480, 379],
      ["silver.dan", "f226cb80d1608b36096c4dce6fbc4a33f3933879.png", 859, 269],
      ["nene.kaito", "9d9473292e7a959e60aa90c5cabe725e1fe41e59.png", 1128, 337],
      ["mia_vona_lee", "e94f42a1bb2ef6a9a3540864192a621f3bc0f4be.png", 1465, 459],
    ],
  },
  {
    tag: "Academia",
    items: [
      ["Takeharu", "a2bbdf24933e5ea2ed787ff7754f8f1bc515f134.png", 0, 252],
      ["Strong_minsu._.", "ad992aed3679f03ef8a30ae3df7e499eb65ab51a.png", 252, 368],
      ["egatan_", "456056998fee6691cfeaf14424f1804bd65fe4f2.png", 620, 253],
      ["chlekgus0718", "14c08d632b67b94964b0fe184d7d1685ced43f4f.png", 873, 601],
      ["d_min912", "2cb1223ebe783757509efe7d7d01cfa19e4d9e75.png", 1474, 455],
    ],
  },
  {
    tag: "Ethereal",
    items: [
      ["zzisoochoi", "451a3120b9663903873092d79a02416510699d74.png", 0, 252],
      ["eujin._02", "29d3da0a5688483145132f6d178d6748f48724fb.png", 252, 294],
      ["hajin.lee", "f33ecc25b57cc6d231a988233a658541dab82128.png", 545, 555],
      ["be.annette", "292296e59aae6ebb92972bf81206a727b95a6449.png", 1099, 253],
      ["yunjjang", "70aca60a0986b06384f1b4393665f3ac1196e091.png", 1352, 253],
      ["buzzer_.beater", "39ff83510647936c29dd69ff74b8d9c427e6de7f.png", 1605, 337],
    ],
  },
];

const storyRail = document.querySelector(".stories__rail");
const storyTag = document.querySelector(".stories__tag");
const storyNext = document.querySelector(".stories__next");
let storyIndex = 0;
let storyIsChanging = false;

function renderStory(state) {
  storyRail.querySelectorAll("figure").forEach((figure) => figure.remove());
  const contentWidth = Math.max(
    ...state.items.map(([, , left, width]) => left + width),
  );
  const railScale = 1872 / contentWidth;

  state.items.forEach(([name, file, left, width, fit = "cover"]) => {
    const figure = document.createElement("figure");
    figure.style.left = `${Math.round(left * railScale)}px`;
    const right = Math.round((left + width) * railScale);
    figure.style.width = `${right - Math.round(left * railScale) + 1}px`;

    const caption = document.createElement("figcaption");
    caption.textContent = name;

    const image = document.createElement("img");
    image.src = `assets/figma/images/${file}`;
    image.alt = `${name}의 CHUGU`;
    image.style.objectFit = fit;

    figure.append(caption, image);
    storyRail.insertBefore(figure, storyTag);
  });

  storyTag.innerHTML = `<span>#</span><strong>${state.tag}</strong>`;
}

storyNext.addEventListener("click", () => {
  if (storyIsChanging) return;
  storyIsChanging = true;
  storyRail.classList.add("is-changing");

  window.setTimeout(() => {
    storyIndex = (storyIndex + 1) % storyStates.length;
    renderStory(storyStates[storyIndex]);

    requestAnimationFrame(() => {
      storyRail.classList.remove("is-changing");
      storyIsChanging = false;
    });
  }, 180);
});

const countElement = document.querySelector(".stories__count");
const countTarget = 1242;
const countFormatter = new Intl.NumberFormat("en-US");
let countAnimationFrame = 0;
let countIsRunning = false;

function startCountUp() {
  window.cancelAnimationFrame(countAnimationFrame);
  countIsRunning = true;
  countElement.classList.add("is-counting");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    countElement.textContent = countFormatter.format(countTarget);
    countElement.classList.remove("is-counting");
    countIsRunning = false;
    return;
  }

  const duration = 1500;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    countElement.textContent = countFormatter.format(Math.round(countTarget * eased));

    if (progress < 1) {
      countAnimationFrame = requestAnimationFrame(tick);
      return;
    }

    countElement.classList.remove("is-counting");
    countIsRunning = false;
  }

  countAnimationFrame = requestAnimationFrame(tick);
}

countElement.textContent = "0";

const countObserver = new IntersectionObserver(
  (entries) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      if (!countIsRunning && countElement.textContent !== countFormatter.format(countTarget)) {
        startCountUp();
      }
      return;
    }

    window.cancelAnimationFrame(countAnimationFrame);
    countIsRunning = false;
    countElement.textContent = "0";
    countElement.classList.remove("is-counting");
  },
  { threshold: 0.35 },
);

countObserver.observe(document.querySelector(".stories"));

const findField = document.querySelector(".find__field");
const specialLetters = [...findField.querySelectorAll("[data-special]")];
const passingLetters = [...findField.querySelectorAll("span:not([data-special])")];
const allFindLetters = [...findField.querySelectorAll("span")];
const foundSpecialLetters = new Set();

function randomizeFindLetters() {
  const placed = [];

  allFindLetters.forEach((letter) => {
    const isSpecial = letter.hasAttribute("data-special");
    const edgePadding = isSpecial ? 120 : 28;
    let position;
    let attempts = 0;

    do {
      position = {
        x: edgePadding + Math.random() * (1600 - edgePadding * 2 - 24),
        y: edgePadding * 0.55 + Math.random() * (618 - edgePadding * 1.1 - 40),
      };
      attempts += 1;
    } while (
      attempts < 80 &&
      placed.some(
        (other) => Math.hypot(position.x - other.x, position.y - other.y) < 92,
      )
    );

    placed.push(position);
    letter.style.left = `${Math.round(position.x)}px`;
    letter.style.top = `${Math.round(position.y)}px`;
  });
}

randomizeFindLetters();

allFindLetters.forEach((letter) => {
  letter.addEventListener("click", () => {
    const special = letter.dataset.special;

    if (!special) {
      letter.classList.add("is-wrong");
      return;
    }

    foundSpecialLetters.add(special);
    letter.classList.add("is-found");
    if (foundSpecialLetters.size === 3) {
      window.location.href = "early-bird.html";
    }
  });
});

findField.addEventListener("pointermove", (event) => {
  const fieldRect = findField.getBoundingClientRect();
  const proximity = Math.max(58, (fieldRect.width / 1600) * 120);
  const passingProximity = Math.max(60, (fieldRect.width / 1600) * 150);

  specialLetters.forEach((letter) => {
    const rect = letter.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
    letter.classList.toggle("is-near", distance <= proximity);
  });

  passingLetters.forEach((letter) => {
    const rect = letter.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
    letter.classList.toggle("is-passing", distance <= passingProximity);
  });
});

findField.addEventListener("pointerleave", () => {
  specialLetters.forEach((letter) => letter.classList.remove("is-near"));
  passingLetters.forEach((letter) => letter.classList.remove("is-passing"));
});

const revealSections = [...document.querySelectorAll("main > section")];
revealSections.forEach((section) => section.classList.add("scroll-reveal"));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.08,
    rootMargin: "0px 0px -8% 0px",
  },
);

revealSections.forEach((section) => revealObserver.observe(section));

const valuesSection = document.querySelector(".values");
const cardsObserver = new IntersectionObserver(
  (entries, observer) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    valuesSection.classList.add("cards-visible");
    window.setTimeout(() => valuesSection.classList.add("cards-ready"), 1250);
    observer.disconnect();
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -6% 0px",
  },
);

cardsObserver.observe(valuesSection);
