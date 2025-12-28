
export const powerMod = (base: bigint, exp: bigint, mod: bigint): bigint => {
  let res = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) res = (res * base) % mod;
    base = (base * base) % mod;
    exp = exp / 2n;
  }
  return res;
};

export const solveCRT = (remainders: number[], moduli: number[]): bigint | null => {
  let prod = moduli.reduce((acc, val) => acc * BigInt(val), 1n);
  let result = 0n;

  for (let i = 0; i < moduli.length; i++) {
    let m = BigInt(moduli[i]);
    let p = prod / m;
    result += BigInt(remainders[i]) * mulInv(p, m) * p;
  }
  return result % prod;
};

const mulInv = (a: bigint, b: bigint): bigint => {
  let b0 = b, t, q;
  let x0 = 0n, x1 = 1n;
  if (b === 1n) return 1n;
  while (a > 1n) {
    q = a / b;
    t = b; b = a % b; a = t;
    t = x0; x0 = x1 - q * x0; x1 = t;
  }
  if (x1 < 0n) x1 += b0;
  return x1;
};

export const solveLinearSystem = (matrix: number[][]): number[] | null => {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    let max = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(matrix[k][i]) > Math.abs(matrix[max][i])) max = k;
    }
    [matrix[i], matrix[max]] = [matrix[max], matrix[i]];

    if (Math.abs(matrix[i][i]) < 1e-12) return null;

    for (let k = i + 1; k < n; k++) {
      const c = -matrix[k][i] / matrix[i][i];
      for (let j = i; j <= n; j++) {
        if (i === j) matrix[k][j] = 0;
        else matrix[k][j] += c * matrix[i][j];
      }
    }
  }

  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = matrix[i][n] / matrix[i][i];
    for (let k = i - 1; k >= 0; k--) {
      matrix[k][n] -= matrix[k][i] * x[i];
    }
  }
  return x;
};

export const safeEval = (expr: string, scope: Record<string, number> = {}): number => {
  if (!expr || expr.trim() === "") return 0;
  
  try {
    let clean = expr.toLowerCase();
    clean = clean.replace(/\^/g, '**');
    clean = clean.replace(/(\d+(?:\.\d*)?)\s*([a-z\(])/g, '$1*$2');
    clean = clean.replace(/([xyn])\s*([a-z\(])/g, '$1*$2');
    clean = clean.replace(/\)\s*([\d[a-z\(])/g, ')*$1');

    const replacements: Record<string, string> = {
      pi: 'Math.PI',
      e: 'Math.E',
      sqrt: 'Math.sqrt',
      sin: 'Math.sin',
      cos: 'Math.cos',
      tan: 'Math.tan',
      abs: 'Math.abs',
      asin: 'Math.asin',
      acos: 'Math.acos',
      atan: 'Math.atan',
      ln: 'Math.log',
      log: 'Math.log10',
    };

    for (const [key, replacement] of Object.entries(replacements)) {
      const re = new RegExp(`\\b${key}\\b`, 'g');
      clean = clean.replace(re, replacement);
    }
    
    const keys = Object.keys(scope);
    const vals = Object.values(scope);
    const fn = new Function(...keys, `return (${clean})`);
    const result = fn(...vals);
    return typeof result === 'number' && !isNaN(result) ? result : 0;
  } catch (e) {
    return 0;
  }
};

export const evaluatePolynomial = (polyStr: string, n: number): number => {
  return safeEval(polyStr, { n });
};

export const getPrimeFactors = (n: number): Map<number, number> => {
  let d = Math.abs(Math.floor(n));
  const factors = new Map<number, number>();
  if (d < 1) return factors;
  
  let temp = d;
  for (let i = 2; i * i <= temp; i++) {
    while (temp % i === 0) {
      factors.set(i, (factors.get(i) || 0) + 1);
      temp /= i;
    }
  }
  if (temp > 1) factors.set(temp, (factors.get(temp) || 0) + 1);
  return factors;
};

export const getAllDivisors = (n: number): number[] => {
  let d = Math.abs(Math.floor(n));
  const divisors: number[] = [];
  if (d === 0) return [];
  for (let i = 1; i * i <= d; i++) {
    if (d % i === 0) {
      divisors.push(i);
      if (i * i !== d) divisors.push(d / i);
    }
  }
  return divisors.sort((a, b) => a - b);
};
