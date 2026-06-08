const games = [
  "Chess",
  "Carrom",
  "Quiz",
  "Drawing",
  "Debate",
  "Puzzle Race",
  "Table Tennis",
  "Badminton",
  "Kho-Kho",
  "Kabaddi",
  "Football",
  "Volleyball"
];

const sports = [
  "100m Race",
  "200m Race",
  "Long Jump",
  "High Jump",
  "Shot Put",
  "Skipping",
  "Cycling",
  "Yoga",
  "Solo Dance",
  "Solo Singing"
];

const form = document.querySelector("#registrationForm");
const gamesChoices = document.querySelector("#gamesChoices");
const sportsChoices = document.querySelector("#sportsChoices");
const scheduleList = document.querySelector("#scheduleList");
const studentSummary = document.querySelector("#studentSummary");
const submitStatus = document.querySelector("#submitStatus");

function renderChoices(container, items, groupName) {
  container.innerHTML = items
    .map(
      (item) => `
        <label class="choice">
          <input type="checkbox" name="${groupName}" value="${item}">
          <span>${item}</span>
        </label>
      `
    )
    .join("");
}

function selectedValues(groupName) {
  return [...document.querySelectorAll(`input[name="${groupName}"]:checked`)].map(
    (input) => input.value
  );
}

function formatTime(totalMinutes) {
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
}

function buildSchedule(activities) {
  const dayStart = 8 * 60;
  const dayEnd = 18 * 60;
  const gameLength = 45;
  const breakLength = 10;
  const rows = [];
  let pointer = dayStart;

  for (const activity of activities) {
    if (pointer + gameLength > dayEnd) {
      rows.push({
        type: "full",
        title: activity,
        time: "Needs next day timing"
      });
      continue;
    }

    rows.push({
      type: "activity",
      title: activity,
      time: `${formatTime(pointer)} - ${formatTime(pointer + gameLength)}`
    });

    pointer += gameLength;

    if (pointer + breakLength <= dayEnd) {
      rows.push({
        type: "break",
        title: "Break",
        time: `${formatTime(pointer)} - ${formatTime(pointer + breakLength)}`
      });
      pointer += breakLength;
    }
  }

  return rows;
}

function renderSchedule() {
  const name = document.querySelector("#studentName").value.trim();
  const className = document.querySelector("#studentClass").value;
  const chosenGames = selectedValues("games");
  const chosenSports = selectedValues("sports");
  const activities = [...chosenGames, ...chosenSports];

  if (!name || !className || activities.length === 0) {
    submitStatus.hidden = true;
    studentSummary.textContent =
      "Fill the name, class, and at least one activity before submitting.";
    scheduleList.innerHTML = "";
    return;
  }

  submitStatus.hidden = false;
  submitStatus.textContent = "Successfully submitted.";
  studentSummary.innerHTML = `<strong>${name}</strong><span>Class ${className} - ${activities.length} activities selected</span>`;

  scheduleList.innerHTML = buildSchedule(activities)
    .map(
      (row) => `
        <li class="schedule-item ${row.type === "break" ? "break" : ""}">
          <strong>${row.title}</strong>
          <span>${row.time}</span>
        </li>
      `
    )
    .join("");
}

renderChoices(gamesChoices, games, "games");
renderChoices(sportsChoices, sports, "sports");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderSchedule();
});

form.addEventListener("reset", () => {
  window.setTimeout(() => {
    submitStatus.hidden = true;
    studentSummary.textContent = "Submit the form to see the selected game timing clearly.";
    scheduleList.innerHTML = "";
  });
});