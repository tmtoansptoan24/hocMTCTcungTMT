
export enum AppView {
  HOME = 'HOME',
  CONGRUENCE = 'CONGRUENCE',
  DIOPHANTINE = 'DIOPHANTINE',
  X_POWER_N = 'X_POWER_N',
  CRT = 'CRT',
  RECURRENCE = 'RECURRENCE',
  OPTIMIZATION = 'OPTIMIZATION',
  TRIANGLE = 'TRIANGLE',
  FUNC_TABLE = 'FUNC_TABLE',
  SYSTEM_EQ = 'SYSTEM_EQ',
  SIMILAR_PROB = 'SIMILAR_PROB',
  DIVISORS = 'DIVISORS',
  POLYNOMIAL = 'POLYNOMIAL',
  CONJUGATE_POWER = 'CONJUGATE_POWER',
  AI_ASSISTANT = 'AI_ASSISTANT'
}

export interface TriangleState {
  a: string; b: string; c: string;
  A: string; B: string; C: string;
  ha: string; hb: string; hc: string;
  ma: string; mb: string; mc: string;
  la: string; lb: string; lc: string;
  P: string; S: string; R: string; r: string;
}
