let intervalId;
let timeLeft = 0;

const timerDisplay = document.getElementById("timer");
const intervalInput = document.getElementById("interval");
const reportDisplay = document.getElementById("report");
const monthlyReport = document.getElementById("monthly-report");
const drankBtn =document.getElementById("drankBtn");
const skipBtn=document.getElementById("skipBtn");
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
 // renderMonthlyReport();
}
function confirmDrankWater(){
    incrementTodayCount();
    alert("Great! Your glass count is updated.");
    drankBtn.style.display="none";
    drankBtn.style.display="none";
}
function skipWater(){
    alert("Remainder skipped. Stay hydrated soon!");
    drankBtn.style.display="none";
    skipBtn.style.display="none";
}

function startReminder() {
  stopReminder();

  const minutes = parseInt(intervalInput.value) ;
  if (!minutes || minutes <= 0) return alert("Please enter valid time");

  localStorage.setItem("reminderInterval", minutes);
  timeLeft = minutes * 60;

  intervalId = setInterval(() => {
    let mins = Math.floor(timeLeft / 60);
    let secs = timeLeft % 60;
    timerDisplay.textContent =`Next reminder in: ${mins}:${secs.toString().padStart(2, "0")}`;

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
      icon: "14216_192_icon.png"
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("🚰 Time to drink water!", {
          body: "Stay hydrated!",
          icon: "14216_192_icon.png"
        });
      }
    });
  }
  drankBtn.style.display="inline";
  skipBtn.style.display="inline";
}

function renderMonthlyReport(month=null,year=null) {
  const today = new Date();
  month = month !== null ? parseInt(month) : today.getMonth();
  year = year !== null ? parseInt(year) : today.getFullYear();
  const data = JSON.parse(localStorage.getItem("waterReport")) || {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let html = "<table><tr><th>Date</th><th>Glasses</th></tr>";

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const count = data[dateStr] || 0;
    html +=`<tr><td>${dateStr}</td><td>${count}</td></tr>`;
  }

  html += "</table>";
  document.getElementById("monthly-report").innerHTML=html;
}

function populateMonthYearSelectors() {
  const monthSelect = document.getElementById("month");
  const yearSelect = document.getElementById("year");

  // Populate months
  const months = [
    "01 - Jan", "02 - Feb", "03 - Mar", "04 - Apr", "05 - May", "06 - Jun",
    "07 - Jul", "08 - Aug", "09 - Sep", "10 - Oct", "11 - Nov", "12 - Dec"
  ];
  months.forEach((label, index) => {
    const opt = document.createElement("option");
    opt.value = String(index + 1).padStart(2, "0");
    opt.textContent = label;
    monthSelect.appendChild(opt);
  });

  // Populate years (from 2023 to current year)
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 2023; y--) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }

  // Set default to current month/year
  monthSelect.value = String(new Date().getMonth() + 1).padStart(2, "0");
  yearSelect.value = currentYear;
}
//function generateReport() {
  //  const today=getToday();
    //let 
  //const month = parseInt(document.getElementById("month").value);
  //const year = parseInt(document.getElementById("year").value);
  //renderMonthlyReport(month, year);
//}
function generateReport() {
  // Make sure the latest glass count is saved for today
  const today = getToday();
  let data = JSON.parse(localStorage.getItem("waterReport")) || {};
  if (!data[today]) {
    data[today] = 0; // Avoid undefined
  }
  localStorage.setItem("waterReport", JSON.stringify(data));

  updateReportUI();         // Update top "Glasses Today"
  renderMonthlyReport();    // Show monthly report table
}

function generateDailyReport() {
  const dateInput = document.getElementById("date").value;
  if (!dateInput) {
    document.getElementById("daily-report").textContent = "Please select a date.";
    return;
  }

  const data = JSON.parse(localStorage.getItem("waterReport")) || {};
  const count = data[dateInput] || 0;

  document.getElementById("daily-report").textContent =`
    On ${dateInput}, you drank 💧 ${count} glass(es) of water.`;
}
function generateReport(){
    updateReportUI();
    renderMonthlyReport();
}
window.onload = () => {
  if (localStorage.getItem("reminderInterval")) {
    intervalInput.value = localStorage.getItem("reminderInterval");
  }
  updateReportUI();
 // populateMonthYearSelectors();
  const today=new Date().toISOString().split("T")[0];
  document.getElementById("date").value=today;
};