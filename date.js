module.exports.getDate = getDate;
module.exports.getDay =getDay;
function getDate() {

  const date = new Date();
  const optionsFull = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return date.toLocaleDateString('en-US', optionsFull);
}
function getDay() {

  const date = new Date();
  const optionsShort = {
    weekday: 'long'
  };

  return date.toLocaleDateString('en-US', optionsShort);
}
