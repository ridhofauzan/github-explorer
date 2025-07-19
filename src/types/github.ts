export interface User {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string; 
}
export interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number; 
}