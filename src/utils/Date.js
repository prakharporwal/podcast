function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

function numOfSecondsToMMSS(x) {
  let t = new Date(x * 1000);
  if (!isValidDate(t)) {
    return "00:00";
  }
  let timeStr = t.toISOString();

  if (timeStr.slice(11, 13) !== "00") {
    return timeStr.slice(11, 19);
  }
  return timeStr.slice(14, 19);
}

export { isValidDate, numOfSecondsToMMSS };
