exports.getDate = function () {
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  return new Intl.DateTimeFormat("en-US", options).format(today);
};
exports.getDay = function () {
  const today = new Date();
  const options = {
    weekday: "long",
  };
  return new Intl.DateTimeFormat("en-US", options).format(today);
};
