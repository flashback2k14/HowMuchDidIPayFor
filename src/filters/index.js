import Vue from "vue";

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "short"
});

Vue.filter("formattedDate", function(value) {
  return value
    ? value.seconds
      ? dateFormatter.format(new Date(value.seconds * 1000))
      : dateFormatter.format(new Date(value))
    : "";
});

const numberFormatter = new Intl.NumberFormat("de-DE", {
  style: "decimal",
  useGrouping: true,
  minimumFractionDigits: 2
});

Vue.filter("formattedDecimal", function(value) {
  return value ? numberFormatter.format(value) : numberFormatter.format(0);
});
