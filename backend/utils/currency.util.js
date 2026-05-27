// Simple currency utilities
const NAIRA_PER_UNIT = 250; // 1 unit = 250 NGN

function unitsToNaira(units) {
  return Math.round(units * NAIRA_PER_UNIT);
}

function nairaToUnits(naira) {
  return naira / NAIRA_PER_UNIT;
}

module.exports = {
  NAIRA_PER_UNIT,
  unitsToNaira,
  nairaToUnits,
};
