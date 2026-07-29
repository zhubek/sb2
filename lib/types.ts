export type TestId = "debruce" | "mbti" | "holland";

export interface Skill {
  id: string;
  name: string;
  score: number; // 0–100
  description: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  professions: string[];
}

export interface Profile {
  id: string;
  name: string;
  description: string;
  programs: Program[];
}

export interface Direction {
  id: string;
  name: string;
  description: string;
  profiles: Profile[];
}

export interface Industry {
  id: string;
  name: string;
  description: string;
  directions: Direction[];
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  city: string;
  country: string;
  foreign: boolean;
  description: string;
  address: string;
  phone: string;
  website: string;
  minScore: number;
  priceFrom: number; // тг/год
  grants: boolean;
  dorm: boolean;
  military: boolean;
  mobility: boolean;
  perks: string[];
  programs: string[];
}

export interface TestAttempt {
  id: string;
  testId: TestId;
  date: string;
  time: string;
  summary: string;
}

export interface TestMeta {
  id: TestId;
  name: string;
  tagline: string;
  duration: string;
  questions: number;
  passed: boolean;
  flagship?: boolean;
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
  href?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  school: string;
  grade: string;
  city: string;
  testsPassed: number;
  registeredAt: string;
}
