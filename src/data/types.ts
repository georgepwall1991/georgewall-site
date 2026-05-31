/** Shared GitHub data shapes. No runtime code — safe to import anywhere. */

export interface Repo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  fork: boolean;
  archived: boolean;
  homepage: string | null;
  html_url: string;
  pushed_at: string;
}

export interface Profile {
  login: string;
  name: string;
  bio: string | null;
  location: string | null;
  avatar_url: string;
  html_url: string;
  followers: number;
  public_repos: number;
}

export interface Snapshot {
  generatedAt: string;
  user: Profile;
  repos: Repo[];
}
