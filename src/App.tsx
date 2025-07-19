import { useState } from "react";
import UserSearchBar from "./components/UserSearchBar";
import UserList from "./components/UserList";
import { searchUsers } from "./api/github";      
import { User } from "./types/github";    

function App() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (keyword: string) => {
    setQuery(keyword);
    setLoading(true);
    setError(null);

    try {
      const result = await searchUsers(keyword); 
      setUsers(result);
    } catch (e: any) {
      setError(e.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">GitHub User Search</h1>
        <UserSearchBar onSearch={handleSearch} loading={loading} />
        {error && <div className="text-red-600 mt-3">{error}</div>}
        <UserList users={users} loading={loading} />
      </div>
    </div>
  );
}

export default App;
