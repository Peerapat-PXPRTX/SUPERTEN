let chart = null;
let history = JSON.parse(localStorage.getItem("fatHistory")) || [];

const itemsPerPage = 5;
let currentPage = 1;

function calculateFat() {
  const fatPercent = parseFloat(document.getElementById("meatType").value);
  const meatName = document.getElementById("meatType").options[document.getElementById("meatType").selectedIndex].text;
  const weight = parseFloat(document.getElementById("weight").value);
  const resultEl = document.getElementById("result");

  if (isNaN(weight) || weight <= 0) {
    resultEl.innerHTML = "<span style='color:red;'>กรุณากรอกน้ำหนักเนื้อให้ถูกต้อง</span>";
    return;
  }

  const fatGram = (weight * fatPercent) / 100;
  const now = new Date();
  const dateTimeStr = now.toLocaleString('th-TH', { hour12: false });

  resultEl.innerHTML = `
    <p><i class="fa-solid fa-oil-can icon"></i>ปริมาณไขมัน: <strong>${fatGram.toFixed(2)}</strong> กรัม (${fatPercent.toFixed(2)}%)</p>
  `;

  updateChart(weight, fatGram);
  saveToHistory({ meatName, weight, fatGram, fatPercent, dateTimeStr });
  renderHistory(currentPage);
}

function updateChart(weight, fatGram) {
  const ctx = document.getElementById("fatChart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['น้ำหนักเนื้อ', 'ไขมัน'],
      datasets: [{
        label: 'กรัม',
        data: [weight, fatGram],
        backgroundColor: ['#3399ff', '#ff9999']
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 10 }
        }
      }
    }
  });
}

function saveToHistory(data) {
  history.unshift(data);
  if (history.length > 50) history.pop();
  localStorage.setItem("fatHistory", JSON.stringify(history));
}


function renderHistory(page = 1) {
  const list = document.getElementById("historyList");
  const pagination = document.getElementById("pagination");

  const totalPages = Math.ceil(history.length / itemsPerPage);
  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages;
  currentPage = page;

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const items = history.slice(start, end);

  // แสดงรายการประวัติ
  list.innerHTML = items.map(item => `
    <li>
      🥩 <strong>${item.meatName}</strong> | ${item.weight} กรัม →
      <strong>${item.fatGram.toFixed(2)} กรัม ไขมัน</strong>
      (${item.fatPercent.toFixed(2)}%)<br/>
      <small style="color:#555;">บันทึกวันที่: ${item.dateTimeStr}</small>
    </li>
  `).join("");

  // แสดงปุ่มหน้า
  let paginationHtml = "";
  for (let i = 1; i <= totalPages; i++) {
    paginationHtml += `<button ${page === i ? 'class="disabled"' : ''} onclick="renderHistory(${i})">${i}</button>`;
  }
  pagination.innerHTML = paginationHtml;
}


function toggleHistory() {
  const modal = document.getElementById("historyModal");
  modal.style.display = "block";

  currentPage = 1; // รีเซ็ตกลับหน้า 1
  renderHistory(currentPage); // แสดงหน้าปัจจุบันเสมอ
}


function closeHistory() {
  const modal = document.getElementById("historyModal");
  modal.style.display = "none";
}

// ปิด modal เมื่อคลิกนอกกล่อง
window.onclick = function (event) {
  const modal = document.getElementById("historyModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
}
const aboutBtn = document.getElementById('aboutBtn');
const aboutModal = document.getElementById('aboutModal');
const closeModal = document.getElementById('closeModal');

aboutBtn.addEventListener('click', () => {
  aboutModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
  aboutModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if(event.target === aboutModal){
    aboutModal.style.display = 'none';
  }
});


