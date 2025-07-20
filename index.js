let intervalId;
let timeLeft = 0;

const timerDisplay = document.getElementById("timer");
const intervalInput = document.getElementById("interval");
const reportDisplay = document.getElementById("report");
const monthlyReport = document.getElementById("monthly-report");
const drankBtn = document.getElementById("drankBtn");
const skipBtn = document.getElementById("skipBtn");
const waterSound = new Audio("water.wav");

function getToday() {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

function updateReportUI() {
  const today = getToday();
  const data = JSON.parse(localStorage.getItem("waterReport")) || {};
  const count = data[today] || 0;
  reportDisplay.textContent = `💧 Glasses Today: ${count}`;
}

function incrementTodayCount() {
  const today = getToday();
  let data = JSON.parse(localStorage.getItem("waterReport")) || {};
  data[today] = (data[today] || 0) + 1;
  localStorage.setItem("waterReport", JSON.stringify(data));
  updateReportUI();
}

function confirmDrankWater() {
  incrementTodayCount();
  alert("Great! Your glass count is updated.");
  drankBtn.style.display = "none";
  skipBtn.style.display = "none";
}

function confirmDidNotDrankWater() {
  alert("No problem. Try to drink next time!");
  drankBtn.style.display = "none";
  skipBtn.style.display = "none";
}

function startReminder() {
  stopReminder();

  const minutes = parseInt(intervalInput.value);
  if (!minutes || minutes <= 0) return alert("Please enter a valid time");

  localStorage.setItem("reminderInterval", minutes);
  timeLeft = minutes * 60;

  intervalId = setInterval(() => {
    let mins = Math.floor(timeLeft / 60);
    let secs = timeLeft % 60;
    timerDisplay.textContent = `Next reminder in: ${mins}:${secs.toString().padStart(2, "0")}`;

    if (timeLeft <= 0) {
      waterSound.play();
      showNotification();
      timeLeft = minutes * 60;
    }
    timeLeft--;
  }, 1000);
}

function stopReminder() {
  clearInterval(intervalId);
  timerDisplay.textContent = "Reminder stopped.";
}

function showNotification() {
  if (Notification.permission === "granted") {
    new Notification("🚰 Time to drink water!", {
      body: "Stay hydrated!",
      icon: "download.png"
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("🚰 Time to drink water!", {
          body: "Stay hydrated!",
          icon: "download.png"
        });
      }
    });
  }
  drankBtn.style.display = "inline";
  skipBtn.style.display = "inline";
}

function renderMonthlyReport() {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const data = JSON.parse(localStorage.getItem("waterReport")) || {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let html = "<table><tr><th>Date</th><th>Glasses</th></tr>";

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const count = data[dateStr] || 0;
    html += `<tr><td>${dateStr}</td><td>${count}</td></tr>`;
  }

  html += "</table>";
  monthlyReport.innerHTML = html;
}

function generateReport() {
  const today = getToday();
  let data = JSON.parse(localStorage.getItem("waterReport")) || {};
  if (!data[today]) {
    data[today] = 0;
    localStorage.setItem("waterReport", JSON.stringify(data));
  }
  incrementTodayCount();
  updateReportUI();
  renderMonthlyReport();
}

function generateDailyReport() {
  const date = document.getElementById("date").value;
  const data = JSON.parse(localStorage.getItem("waterReport")) || {};
  const count = data[date] || 0;
  document.getElementById("daily-report").innerText =
    date ? `You drank ${count} glass(es) on ${date}` : "Please select a date";
}

updateReportUI();