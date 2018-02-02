export function normalRandom(mean=0.0, variance=1.0) {
  let V1;
  let V2;
  let S;
  do {
    const U1 = Math.random();
    const U2 = Math.random();
    V1 = 2 * U1 - 1;
    V2 = 2 * U2 - 1;
    S = V1 * V1 + V2 * V2;
  } while (S > 1);

  let X = Math.sqrt(-2 * Math.log(S) / S) * V1;
  // Y = Math.sqrt(-2 * Math.log(S) / S) * V2;
  X = mean + Math.sqrt(variance) * X;
  // Y = mean + Math.sqrt(variance) * Y ;
  return X;
}
