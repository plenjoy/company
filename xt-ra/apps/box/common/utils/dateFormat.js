export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join('-');
};

export const formatTime = (date) => {
  const d = new Date(date);
  let hours = String(d.getHours());
  let minutes = String(d.getMinutes());
  let seconds = String(d.getSeconds());

  if (hours.length < 2) hours = `0${hours}`;
  if (minutes.length < 2) minutes = `0${minutes}`;
  if (seconds.length < 2) seconds = `0${seconds}`;

  return [hours, minutes, seconds].join(':');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return `${formatDate(date)} ${formatTime(date)}`;
};
