import { Repo, User } from "../types/github";

const BASE = 'https://api.github.com';

export async function searchUsers(q: string): Promise<User[]> {
  const res = await fetch(`${BASE}/search/users?q=${q}&per_page=5`);
  if (!res.ok) throw new Error('Failed to search users');
  const { items } = await res.json();
  return items;
}

export async function getUserRepos(username: string): Promise<Repo[]> {
  const res = await fetch(`${BASE}/users/${username}/repos`);
  if (!res.ok) throw new Error('Failed to fetch repos');
  return await res.json();
}