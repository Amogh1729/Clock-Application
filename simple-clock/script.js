function updateClock() {
  const now = new Date();
  
  // Time components
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const hoursStr = String(hours).padStart(2, '0');

  // Update DOM
  document.getElementById('clock').textContent = `${hoursStr}:${minutes}:${seconds}`;
  document.getElementById('ampm').textContent = ampm;

  // Date components
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  document.getElementById('day-name').textContent = days[now.getDay()];
  document.getElementById('date').textContent = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}

// Update immediately, then every second
updateClock();
setInterval(updateClock, 1000);
