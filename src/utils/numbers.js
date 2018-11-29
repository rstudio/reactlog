// @flow

let roundDecimals = function(value: number, decimals: number): number {
  let roundedNumber = Math.round(Number(`${value}e${decimals}`));
  return Number(`${roundedNumber}e-${decimals}`);
};

export { roundDecimals };
