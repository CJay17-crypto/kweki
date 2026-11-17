
const SUPABASE_URL = "https://bogfvrulsmgeqrelhcrv.supabase.co";
const SUPABASE_KEY = "sb_publishable_Vn5UQBH2ODUMrVu7Zm571A_WPoR6V2J";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const STARTER = [
  ["a","Speaker 1","Cabardo",[
    "Why would the complete absence of greenhouse gases make Earth uninhabitable, even though we currently view them as a major threat?",
    "If Earth is constantly absorbing shortwave solar radiation from the sun, why doesn't the planet naturally overheat under normal conditions?",
    "How does the analogy of glass panes of a greenhouse accurately explain the difference between incoming and outgoing radiation?"
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
    "Why is transitioning to renewables described as preventing both environmental collapse and economic disruption?"
  ]],
  ["h","Speaker 4","Echavez",[
    "Why does the Paris Agreement require cutting global CO2 emissions by 45% by 2030 if the ultimate deadline for net-zero emissions is 2050?",
    "What operational advantage does Ocean Thermal Energy Conversion (OTEC) have over traditional solar or wind power?",
    "Why is transitioning to renewables described as preventing both environmental collapse and economic disruption?"
  ]],
  ["e","Speaker 5","Nguho",[
    "How can global warming simultaneously cause worsening droughts in some areas and rising sea levels or intense cyclones in others?",
    "Why is coral reef bleaching linked to accelerated species extinction in the ocean?",
    "Why do rising sea levels represent an existential risk rather than just a temporary weather inconvenience for low-lying island nations?"
  ]],
  ["g","Speaker 6","Caterial",[
    "How can a nation still experience an energy crisis even if it has abundant reserves of coal, oil, or natural gas?",
    "Why do geopolitical conflicts like the 1990 Gulf War or recent conflicts in the Middle East immediately trigger global oil price hikes?",
    "Why is leaving renewable energy options unexplored considered a direct cause of global energy crises?"
  ]],
  ["j","Speaker 7","Torres",[
    "How does restoring mangrove forests solve both a global climate problem and a local Philippine disaster risk at the same time?",
    "Why is replacing incandescent bulbs with LEDs and minimizing air conditioning considered a direct climate mitigation action rather than just a way to save money?",
    "If government policies already target large-scale renewable energy projects, why are individual actions like the 3Rs, biking, and backyard gardening still necessary?"
  ]],
  ["i","Speaker 8","Joromo",[
    "Why does the Philippines' geography as a megadiverse yet highly vulnerable archipelagic nation require balancing both mitigation and adaptation?",
    "If science and technology already provide the tools to measure, predict, and replace fossil fuels with clean energy, why is the climate crisis still unresolved?",
    "What happens to scientific progress if society fails to pair it with environmental consciousness?"
  ]],
  ["k","Speaker 8","Joromo",[
    "Why does the Philippines' geography as a megadiverse yet highly vulnerable archipelagic nation require balancing both mitigation and adaptation?",
    "If science and technology already provide the tools to measure, predict, and replace fossil fuels with clean energy, why is the climate crisis still unresolved?",
    "What happens to scientific progress if society fails to pair it with environmental consciousness?"
  ]]
];

let topics = [];
let view = "topics";

const $ = selector => document.querySelector(selector);

const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[char]));

function showError(error) {
  console.error(error);
  alert("Database error: " + (error.message || error));
}

// LOAD DATABASE
async function loadData() {
  let result = await db.from("topics").select("*");

  if (result.error) throw result.error;

  // Add starter content only if the database is empty.
  if (result.data.length === 0) {
    const inserted = await db.from("topics").insert(
      STARTER.map(item => ({
        part: item[0],
        speaker: item[1],
        answerer: item[2],
        title: "Part [" + item[0] + "]"
      }))
    ).select();

    if (inserted.error) throw inserted.error;

    const topicByPart = Object.fromEntries(
      inserted.data.map(topic => [topic.part, topic])
    );

    const questionRows = [];

    STARTER.forEach(item => {
      item[3].forEach(body => {
        questionRows.push({
          topic_id: topicByPart[item[0]].id,
          body,
          asked: false,
          used: false
        });
      });
    });

    const addedQuestions = await db
      .from("questions")
      .insert(questionRows);

    if (addedQuestions.error) throw addedQuestions.error;

    return loadData();
  }

  const questionResult = await db
    .from("questions")
    .select("*");

  if (questionResult.error) throw questionResult.error;

  topics = result.data.map(topic => ({
    ...topic,
    questions: questionResult.data.filter(
      question => question.topic_id === topic.id
    )
  }));

  render();
}

// DISPLAY
function render() {
  const questions = topics.flatMap(topic => topic.questions);

  $("#topic-count").textContent = topics.length;
  $("#question-count").textContent = questions.length;
  $("#asked-count").textContent =
    questions.filter(question => question.asked).length;

  document.querySelectorAll(".tab").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.view === view
    );
  });

  $("#content").innerHTML =
    view === "topics" ? topicView() : classmateView();
}

function questionHTML(question, index) {
  return `
    <div class="q">
      <span class="num">${index + 1}.</span>
      <div class="body ${question.asked ? "done" : ""}">
        ${esc(question.body)}
      </div>
      <div class="qactions">
        <span class="pill ${question.asked ? "asked" : ""}">
          ${question.asked ? "Asked" : "Not asked"}
        </span>
        ${question.used ? '<span class="pill used">Used</span>' : ""}
        <button class="small" data-a="toggle" data-id="${question.id}">
          ${question.asked ? "Undo" : "Mark asked"}
        </button>
        <button class="small" data-a="editq" data-id="${question.id}">Edit</button>
        <button class="small" data-a="delq" data-id="${question.id}">Delete</button>
      </div>
    </div>
  `;
}

function topicView() {
  if (!topics.length) {
    return '<div class="empty">No topics yet. Add your first topic.</div>';
  }

  return topics.map(topic => `
    <article class="card">
      <div class="head">
        <div>
          <span class="part">PART [${esc(topic.part)}]</span>
          <span class="title">${esc(topic.title)}</span>
          <div class="meta">
            ${esc(topic.speaker)}
            ${topic.answerer
              ? ' · Answerer: <strong>' + esc(topic.answerer) + '</strong>'
              : ""}
          </div>
        </div>
        <div class="actions">
          <button class="small" data-a="addq" data-id="${topic.id}">＋ Question</button>
          <button class="small" data-a="editt" data-id="${topic.id}">Edit</button>
          <button class="small" data-a="delt" data-id="${topic.id}">Delete</button>
        </div>
      </div>
      <div class="questions">
        ${topic.questions.map(questionHTML).join("")}
      </div>
    </article>
  `).join("");
}

function classmateView() {
  const groups = {};

  topics.forEach(topic => {
    (groups[topic.answerer || "Unassigned"] ??= []).push(topic);
  });

  return Object.entries(groups).map(([name, assignedTopics]) => `
    <article class="person">
      <h2>${esc(name)}</h2>
      ${assignedTopics.map(topic => `
        <div class="personpart">
          <b>${esc(topic.title)} · Part [${esc(topic.part)}]</b>
          ${topic.questions.map((question, index) => `
            <p>
              ${index + 1}. ${esc(question.body)}
              ${question.asked ? '<span class="pill asked">Asked</span>' : ""}
            </p>
          `).join("")}
        </div>
      `).join("")}
    </article>
  `).join("") || '<div class="empty">No classmates assigned.</div>';
}

// FORMS
function openTopic(topic) {
  $("#topic-form").reset();
  $("#topic-id").value = topic?.id || "";
  $("#topic-heading").textContent = topic ? "Edit topic" : "Add a topic";
  $("#topic-title").value = topic?.title || "";
  $("#topic-part").value = topic?.part || "";
  $("#topic-speaker").value = topic?.speaker || "";
  $("#topic-answerer").value = topic?.answerer || "";
  $("#topic-dialog").showModal();
}

function openQuestion(topicId, question) {
  $("#question-form").reset();
  $("#question-topic").value = topicId;
  $("#question-id").value = question?.id || "";
  $("#question-heading").textContent =
    question ? "Edit question" : "Add a question";
  $("#question-body").value = question?.body || "";
  $("#warning").hidden = true;
  $("#question-form").dataset.confirm = "";
  $("#save-question").textContent = "Save question";
  $("#question-dialog").showModal();
}

$("#add-topic").onclick = () => openTopic();

document.querySelectorAll(".tab").forEach(button => {
  button.onclick = () => {
    view = button.dataset.view;
    render();
  };
});

document.querySelectorAll("[data-close]").forEach(button => {
  button.onclick = () => {
    $("#" + button.dataset.close).close();
  };
});

// SAVE TOPIC
$("#topic-form").onsubmit = async event => {
  event.preventDefault();

  const id = $("#topic-id").value;

  const values = {
    title: $("#topic-title").value.trim(),
    part: $("#topic-part").value.trim(),
    speaker: $("#topic-speaker").value.trim(),
    answerer: $("#topic-answerer").value.trim()
  };

  try {
    if (id) {
      const result = await db
        .from("topics")
        .update(values)
        .eq("id", id);

      if (result.error) throw result.error;

      Object.assign(
        topics.find(topic => topic.id === id),
        values
      );
    } else {
      const result = await db
        .from("topics")
        .insert(values)
        .select()
        .single();

      if (result.error) throw result.error;

      topics.push({
        ...result.data,
        questions: []
      });
    }

    $("#topic-dialog").close();
    render();

  } catch (error) {
    showError(error);
  }
};

// DUPLICATE DETECTION
function similarity(a, b) {
  const words = text => new Set(
    text.toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
  );

  const x = words(a);
  const y = words(b);
  let matches = 0;

  for (const word of x) {
    if (y.has(word)) matches++;
  }

  return matches / Math.max(1, x.size + y.size - matches);
}

// SAVE QUESTION
$("#question-form").onsubmit = async event => {
  event.preventDefault();

  const topicId = $("#question-topic").value;
  const id = $("#question-id").value;
  const body = $("#question-body").value.trim();

  if (!body) return;

  const allQuestions = topics.flatMap(topic => topic.questions);

  const duplicate = allQuestions.find(question =>
    question.id !== id &&
    question.body.toLowerCase() === body.toLowerCase()
  );

  if (duplicate) {
    $("#warning").hidden = false;
    $("#warning").textContent =
      "An identical question already exists.";
    return;
  }

  const similar = allQuestions.some(question =>
    question.id !== id &&
    similarity(question.body, body) >= 0.78
  );

  if (similar && $("#question-form").dataset.confirm !== "yes") {
    $("#warning").hidden = false;
    $("#warning").textContent =
      "A similar question may already exist. Submit again if intentional.";
    $("#question-form").dataset.confirm = "yes";
    $("#save-question").textContent = "Add anyway";
    return;
  }

  try {
    if (id) {
      const result = await db
        .from("questions")
        .update({ body })
        .eq("id", id);

      if (result.error) throw result.error;

      const topic = topics.find(topic =>
        topic.questions.some(question => question.id === id)
      );

      topic.questions.find(question => question.id === id).body = body;

    } else {
      const result = await db
        .from("questions")
        .insert({
          topic_id: topicId,
          body,
          asked: false,
          used: false
        })
        .select()
        .single();

      if (result.error) throw result.error;

      topics.find(topic => topic.id === topicId)
        .questions.push(result.data);
    }

    $("#question-dialog").close();
    render();

  } catch (error) {
    showError(error);
  }
};

// ACTIONS
$("#content").onclick = async event => {
  const button = event.target.closest("[data-a]");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.a;

  try {
    if (action === "editt") {
      openTopic(topics.find(topic => topic.id === id));
    }

    if (action === "addq") {
      openQuestion(id);
    }

    if (action === "editq") {
      const topic = topics.find(topic =>
        topic.questions.some(question => question.id === id)
      );

      openQuestion(
        topic.id,
        topic.questions.find(question => question.id === id)
      );
    }

    if (
      action === "delt" &&
      confirm("Delete this topic and all its questions?")
    ) {
      const result = await db
        .from("topics")
        .delete()
        .eq("id", id);

      if (result.error) throw result.error;

      topics = topics.filter(topic => topic.id !== id);
      render();
    }

    if (
      action === "delq" &&
      confirm("Delete this question?")
    ) {
      const result = await db
        .from("questions")
        .delete()
        .eq("id", id);

      if (result.error) throw result.error;

      topics.forEach(topic => {
        topic.questions = topic.questions.filter(
          question => question.id !== id
        );
      });

      render();
    }

    // MARK AS ASKED: SAVE DIRECTLY TO SUPABASE
    if (action === "toggle") {
      const question = topics
        .flatMap(topic => topic.questions)
        .find(question => question.id === id);

      const asked = !question.asked;

      const result = await db
        .from("questions")
        .update({
          asked: asked,
          used: asked
        })
        .eq("id", id);

      if (result.error) throw result.error;

      question.asked = asked;
      question.used = asked;

      render();
    }

  } catch (error) {
    showError(error);
  }
};

// REALTIME UPDATES
const channel = db
  .channel("kweki-live-updates")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "topics" },
    () => loadData().catch(showError)
  )
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "questions" },
    () => loadData().catch(showError)
  )
  .subscribe();

loadData().catch(showError);

