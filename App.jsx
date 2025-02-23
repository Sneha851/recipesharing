import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Navbar({ user, setUser }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <h1 className="text-xl font-bold">🍽 Recipe Sharing</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        {user ? (
          <>
            <Link to="/add-recipe" className="hover:text-gray-300">Add Recipe</Link>
            <button onClick={handleLogout} className="hover:text-red-400">Logout</button>
          </>
        ) : (
          <Link to="/login" className="hover:text-gray-300">Login</Link>
        )}
      </div>
    </nav>
  );
}

function Home() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/recipes")
      .then((res) => setRecipes(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Recipes</h2>
      <div className="grid grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="bg-white p-4 shadow-lg rounded-lg">
            <h3 className="text-lg font-bold">{recipe.title}</h3>
            <p className="text-gray-700">{recipe.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddRecipe() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/recipes", { title, description }, {
      headers: { Authorization: localStorage.getItem("token") }
    })
    .then(() => navigate("/"))
    .catch((err) => alert("Error adding recipe"));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Recipe</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Title" required value={title} 
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea placeholder="Description" required value={description} 
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
}

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/login", { email, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.token);
        navigate("/");
      })
      .catch(() => alert("Invalid credentials"));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" required value={email} 
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input type="password" placeholder="Password" required value={password} 
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(localStorage.getItem("token"));

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-recipe" element={user ? <AddRecipe /> : <Login setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
