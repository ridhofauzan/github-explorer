import React, { useState } from "react";
import { Repo } from "../types/github";
import { getUserRepos } from "../api/github";

interface GithubUser {
  login: string;
  avatar_url: string;
  html_url: string;
}

interface UserListProps {
  users: GithubUser[];
  loading?: boolean;
}

const UserList: React.FC<UserListProps> = ({ users, loading }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [repos, setRepos] = useState<Record<string, Repo[]>>({});
  const [loadingRepo, setLoadingRepo] = useState<string | null>(null);

  const handleExpand = async (login: string) => {
    if (expanded === login) {
      setExpanded(null);
      return;
    }
    setExpanded(login);
    if (!repos[login]) {
      setLoadingRepo(login);
      try {
        const userRepos = await getUserRepos(login);
        setRepos((prev) => ({ ...prev, [login]: userRepos }));
      } catch {
        setRepos((prev) => ({ ...prev, [login]: [] }));
      } finally {
        setLoadingRepo(null);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-6">Loading...</div>;
  }

  if (!users.length) {
    return <div className="text-center text-gray-400 py-6">No users found</div>;
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {users.map((user) => (
        <li key={user.login} className="bg-white rounded-lg shadow border hover:shadow-md transition">
          <div
            className="flex items-center gap-3 p-3 cursor-pointer"
            onClick={() => handleExpand(user.login)}
          >
            <img src={user.avatar_url} alt={user.login} className="w-12 h-12 rounded-full border" />
            <div className="flex-1">
              <div className="font-semibold">{user.login}</div>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm hover:underline"
                onClick={e => e.stopPropagation()}
              >
                See Profile
              </a>
            </div>
            <span className="ml-auto text-gray-400">{expanded === user.login ? "▲" : "▼"}</span>
          </div>
          {expanded === user.login && (
            <div className="p-3 border-t">
              {loadingRepo === user.login ? (
                <div className="text-gray-400 text-sm">Loading repos...</div>
              ) : (
                <ul className="space-y-2">
                  {(repos[user.login]?.length ? repos[user.login] : [{ name: "No repos found", html_url: "#", description: "" }]).map((repo, idx) => (
                    <li key={"id" in repo ? repo.id : `empty-${idx}`} className="flex justify-between items-center">
                      <div>
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {repo.name}
                        </a>
                        <div className="text-xs text-gray-500">{repo.description}</div>
                      </div>
                      {"stargazers_count" in repo && (
                        <div className="text-yellow-500 text-sm ml-4 text-center">
                          <div>★</div> 
                          <div>{repo.stargazers_count}</div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default UserList;
