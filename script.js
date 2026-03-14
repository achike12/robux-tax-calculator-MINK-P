const robuxInput = document.getElementById('robux');
const devexInput = document.getElementById('devex');
const calculateBtn = document.getElementById('calculateBtn');
const taxSpan = document.getElementById('tax');
const usdSpan = document.getElementById('usd');
const copyBtn = document.getElementById('copyBtn');
const tierSelect = document.getElementById('tier');
const currencySelect = document.getElementById('currency');
const currencySymbol = document.getElementById('currencySymbol');
const darkModeToggle = document.getElementById('darkMode');
const graphCanvas = document.getElementById('graph');

const exchangeRates = { USD: 1, EUR: 0.92, GBP: 0.81 };
let chart;

function calculate() {
  let robux = parseFloat(robuxInput.value);
  let devexRate = parseFloat(devexInput.value);
  let tier = tierSelect.value;
  let currency = currencySelect.value;

  if(isNaN(robux) || robux <= 0) {
    alert('Enter a valid Robux amount!');
    return;
  }

  let usdPerRobux = 0.0035;

  if(tier === "2") devexRate = Math.min(devexRate + 5, 100);

  const usdPayout = robux * usdPerRobux * (devexRate / 100) * exchangeRates[currency];
  const tax = robux - (robux * (devexRate / 100));

  taxSpan.textContent = tax.toFixed(2);
  usdSpan.textContent = usdPayout.toFixed(2);
  currencySymbol.textContent = currency === "USD" ? "$" : currency === "EUR" ? "€" : "£";

  updateGraph(tax, usdPayout);
}

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(usdSpan.textContent)
    .then(() => alert('Payout copied!'))
    .catch(err => console.log(err));
});

darkModeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark', darkModeToggle.checked);
});

calculateBtn.addEventListener('click', calculate);
robuxInput.addEventListener('keyup', calculate);
devexInput.addEventListener('keyup', calculate);
tierSelect.addEventListener('change', calculate);
currencySelect.addEventListener('change', calculate);

function updateGraph(tax, payout) {
  if(chart) chart.destroy();
  chart = new Chart(graphCanvas, {
    type: 'bar',
    data: {
      labels: ['Tax', 'Payout'],
      datasets: [{
        label: 'Robux Value',
        data: [tax, payout],
        backgroundColor: ['#ff4d4d', '#1a73e8']
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
}
