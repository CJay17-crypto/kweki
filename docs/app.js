
const KEY = "kweki-classroom-data-v1";

const STARTER = [
["a","Speaker 1","Cabardo",[
"Why would the complete absence of greenhouse gases make Earth uninhabitable, even though we currently view them as a major threat?",
"If Earth is constantly absorbing shortwave solar radiation from the sun, why doesn't the planet naturally overheat under normal conditions?",
"How does the analogy of \"glass panes of a greenhouse\" accurately explain the difference between incoming and outgoing radiation?"
]],
["b","Speaker 2","Perpetua",[
"Greenhouse gases make up less than 1% of Earth's atmosphere alongside Nitrogen (78%) and Oxygen (21%). Why is a 38% increase in CO2 within that tiny fraction enough to disrupt the entire planet's climate?",
"Why is the Industrial Revolution in the late 1700s used as the baseline for measuring modern climate change?",
"How do clearing forests and burning fossil fuels work together to accelerate the Enhanced Greenhouse Effect?"
]],
["c","Speaker 3","Gonzales",[
"If water vapor is the most abundant heat-trapping gas, why do environmental policies focus more on regulating CO2, methane, nitrous oxide, and synthetic gases?",
"Why would someone living in a region that never gets hit by a typhoon or extreme heatwave still face severe health risks from climate change?",
"How does ground-level air pollution connect climate change to cardio-respiratory illnesses?"
]],
["f","Speaker 3","Gonzales",[
"If water vapor is the most abundant heat-trapping gas, why do environmental policies focus more on regulating CO2, methane, nitrous oxide, and synthetic gases?",
"Why would someone living in a region that never gets hit by a typhoon or extreme heatwave still face severe health risks from climate change?",
"How does ground-level air pollution connect climate change to cardio-respiratory illnesses?"
]],
["d","Speaker 4","Echavez",[
"Why does the Paris Agreement require cutting global CO2 emissions by 45% by 2030 if the ultimate deadline for net-zero emissions is 2050?",
"What operational advantage does Ocean Thermal Energy Conversion (OTEC) have over traditional solar or wind power?",
"Why is transitioning to renewables described as preventing both \"environmental collapse\" and \"economic disruption\"?"
]],
["h","Speaker 4","Echavez",[
"Why does the Paris Agreement require cutting global CO2 emissions by 45% by 2030 if the ultimate deadline for net-zero emissions is 2050?",
"What operational advantage does Ocean Thermal Energy Conversion (OTEC) have over traditional solar or wind power?",
"Why is transitioning to renewables described as preventing both \"environmental collapse\" and \"economic disruption\"?"
]],
["e","Speaker 5","Nguho",[
"How can global warming simultaneously cause worsening droughts in some areas and rising sea levels or intense cyclones in others?",
"Why is coral reef bleaching linked to accelerated species extinction in the ocean?",
"Why do rising sea levels represent an \"existential risk\" rather than just a temporary weather inconvenience for low-lying island nations?"
]],
["g","Speaker 6","Caterial",[
"How can a nation still experience an energy crisis even if it has abundant reserves of coal, oil, or natural gas?",
"Why do geopolitical conflicts—like the 1990 Gulf War or recent conflicts in the Middle East—immediately trigger global oil price hikes?",
"Why is leaving renewable energy options \"unexplored\" considered a direct cause of global energy crises?"
]],
["j","Speaker 7","Torres",[
"How does restoring mangrove forests solve both a global climate problem and a local Philippine disaster risk at the same time?",
"Why is replacing incandescent bulbs with LEDs and minimizing air conditioning considered a direct climate mitigation action rather than just a way to save money?",
"If government policies already target large-scale renewable energy projects, why are individual actions like the 3Rs, biking, and backyard gardening still necessary?"
]],
["i","Speaker 8","Joromo",[
"Why does the Philippines' geography as a \"megadiverse yet highly vulnerable archipelagic nation\" require balancing both mitigation and adaptation?",
"If science and technology already provide the tools to measure, predict, and replace fossil fuels with clean energy, why is the climate crisis still unresolved?",
"What happens to \"scientific progress\" if society fails to pair it with environmental consciousness?"
]],
["k","Speaker 8","Joromo",[
"Why does the Philippines' geography as a \"megadiverse yet highly vulnerable archipelagic nation\" require balancing both mitigation and adaptation?",
"If science and technology already provide the tools to measure, predict, and replace fossil fuels with clean energy, why is the climate crisis still unresolved?",
"What happens to \"scientific progress\" if society fails to pair it with environmental consciousness?"
]]
];

const makeStarter = () => STARTER.map((x,i) => ({
  id: i+1,
  part: x[0],
  speaker: x[1],
  answerer: x[2],
  title: `Part [${x[0]}]`,
  questions: x[3].map((body,j) => ({
    id: (i+1)*10+j,
    body,
    asked: false,
    used: false
  }))
}));

let topics;

try {
  const saved = localStorage.getItem(KEY);
  topics = saved ? JSON.parse(saved) : makeStarter();

  if (!saved) {
    localStorage.setItem(KEY, JSON.stringify(topics));
  }
} catch {
  topics = makeStarter();
}

let view = "topics";
let nextId = 1000;

const $ = s => document.querySelector(s);

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[c]));

function save() {
  localStorage.setItem(KEY, JSON.stringify(topics));
  render();
}

function render() {
  const qs = topics.flatMap(t => t.questions);

  $("#topic-count").textContent = topics.length;
  $("#question-count").textContent = qs.length;
  $("#asked-count").textContent = qs.filter(q => q.asked).length;

  document.querySelectorAll(".tab").forEach(b => {
    b.classList.toggle("active", b.dataset.view === view);
  });

  $("#content").innerHTML =
    view === "topics" ? topicView() : classmateView();
}

function questionHTML(q,i) {
  return `
    <div class="q">
      <span class="num">${i+1}.</span>
      <div class="body ${q.asked ? "done" : ""}">
        ${esc(q.body)}
      </div>
      <div class="qactions">
        <span class="pill ${q.asked ? "asked" : ""}">
          ${q.asked ? "Asked" : "Not asked"}
        </span>
        ${q.used ? '<span class="pill used">Used</span>' : ""}
        <button class="small" data-a="toggle" data-id="${q.id}">
          ${q.asked ? "Undo" : "Mark asked"}
        </button>
        <button class="small" data-a="editq" data-id="${q.id}">Edit</button>
        <button class="small" data-a="delq" data-id="${q.id}">Delete</button>
      </div>
    </div>`;
}

function topicView() {
  if (!topics.length) {
    return '<div class="empty">No topics yet. Add your first topic.</div>';
  }

  return topics.map(t => `
    <article class="card">
      <div class="head">
        <div>
          <span class="part">
            ${t.part ? "PART ["+esc(t.part)+"]" : "TOPIC"}
          </span>
          <span class="title">${esc(t.title)}</span>
          <div class="meta">
            ${esc(t.speaker)}
            ${t.answerer ? "· Answerer: "+esc(t.answerer) : ""}
          </div>
        </div>

        <div class="actions">
          <button class="small" data-a="addq" data-id="${t.id}">
            ＋ Question
          </button>
          <button class="small" data-a="editt" data-id="${t.id}">Edit</button>
          <button class="small" data-a="delt" data-id="${t.id}">Delete</button>
        </div>
      </div>

      <div class="questions">
        ${t.questions.map(questionHTML).join("")}
      </div>
    </article>
  `).join("");
}

function classmateView() {
  const groups = {};

  topics.forEach(t => {
    (groups[t.answerer || "Unassigned"] ??= []).push(t);
  });

  const entries = Object.entries(groups);

  if (!entries.length) {
    return '<div class="empty">No classmates assigned.</div>';
  }

  return entries.map(([name,ts]) => `
    <article class="person">
      <h2>${esc(name)}</h2>

      ${ts.map(t => `
        <div class="personpart">
          <b>${esc(t.title)} · Part [${esc(t.part)}]</b>

          ${t.questions.map((q,i) => `
            <p>
              ${i+1}. ${esc(q.body)}
              ${q.asked ? '<span class="pill asked">Asked</span>' : ""}
            </p>
          `).join("")}
        </div>
      `).join("")}
    </article>
  `).join("");
}

function openTopic(t) {
  $("#topic-form").reset();
  $("#topic-id").value = t?.id || "";
  $("#topic-heading").textContent = t ? "Edit topic" : "Add a topic";

  $("#topic-title").value = t?.title || "";
  $("#topic-part").value = t?.part || "";
  $("#topic-speaker").value = t?.speaker || "";
  $("#topic-answerer").value = t?.answerer || "";

  $("#topic-dialog").showModal();
}

function openQuestion(topicId,q) {
  $("#question-form").reset();
  $("#question-topic").value = topicId;
  $("#question-id").value = q?.id || "";

  $("#question-heading").textContent =
    q ? "Edit question" : "Add a question";

  $("#question-body").value = q?.body || "";
  $("#warning").hidden = true;
  $("#save-question").textContent = "Save question";

  $("#question-dialog").showModal();
}

$("#add-topic").onclick = () => openTopic();

document.querySelectorAll(".tab").forEach(b => {
  b.onclick = () => {
    view = b.dataset.view;
    render();
  };
});

document.querySelectorAll("[data-close]").forEach(b => {
  b.onclick = () => $("#" + b.dataset.close).close();
});

$("#topic-form").onsubmit = e => {
  e.preventDefault();

  const id = Number($("#topic-id").value);

  const values = {
    title: $("#topic-title").value.trim(),
    part: $("#topic-part").value.trim(),
    speaker: $("#topic-speaker").value.trim(),
    answerer: $("#topic-answerer").value.trim()
  };

  if (id) {
    Object.assign(topics.find(t => t.id === id), values);
  } else {
    topics.push({
      id: nextId++,
      ...values,
      questions: []
    });
  }

  $("#topic-dialog").close();
  save();
};

$("#question-form").onsubmit = e => {
  e.preventDefault();

  const topicId = Number($("#question-topic").value);
  const id = Number($("#question-id").value);
  const body = $("#question-body").value.trim();

  if (!body) return;

  const all = topics.flatMap(t => t.questions);

  const duplicate = all.find(q =>
    q.id !== id && q.body.toLowerCase() === body.toLowerCase()
  );

  if (duplicate) {
    $("#warning").hidden = false;
    $("#warning").textContent =
      "An identical question already exists. Please review the existing question.";
    return;
  }

  const similar = all.find(q =>
    q.id !== id && wordSimilarity(q.body, body) >= 0.78
  );

  if (similar && !$("#question-form").dataset.confirm) {
    $("#warning").hidden = false;
    $("#warning").textContent =
      "A similar question may already exist. Submit again only if this is intentionally different.";

    $("#question-form").dataset.confirm = "yes";
    $("#save-question").textContent = "Add anyway";
    return;
  }

  if (id) {
    all.find(q => q.id === id).body = body;
  } else {
    topics.find(t => t.id === topicId).questions.push({
      id: nextId++,
      body,
      asked: false,
      used: false
    });
  }

  $("#question-form").dataset.confirm = "";
  $("#question-dialog").close();
  save();
};

function wordSimilarity(a,b) {
  const words = s => new Set(
    s.toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
  );

  const x = words(a);
  const y = words(b);
  let n = 0;

  for (const w of x) {
    if (y.has(w)) n++;
  }

  return n / Math.max(1, x.size + y.size - n);
}

$("#content").onclick = e => {
  const b = e.target.closest("[data-a]");
  if (!b) return;

  const id = Number(b.dataset.id);
  const action = b.dataset.a;

  if (action === "editt") {
    openTopic(topics.find(t => t.id === id));
  }

  if (action === "addq") {
    openQuestion(id);
  }

  if (action === "editq") {
    const t = topics.find(t =>
      t.questions.some(q => q.id === id)
    );

    openQuestion(t.id, t.questions.find(q => q.id === id));
  }

  if (action === "delt" &&
      confirm("Delete this topic and all its questions?")) {
    topics = topics.filter(t => t.id !== id);
  }

  if (action === "delq" &&
      confirm("Delete this question?")) {
    topics.forEach(t => {
      t.questions = t.questions.filter(q => q.id !== id);
    });
  }

  if (action === "toggle") {
    topics.forEach(t => {
      t.questions.forEach(q => {
        if (q.id === id) {
          q.asked = !q.asked;
          q.used = q.asked;
        }
      });
    });
  }

  if (["delt","delq","toggle"].includes(action)) {
    save();
  }
};

render();
