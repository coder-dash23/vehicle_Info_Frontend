import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const Login = () => {
  const cookies = useMemo(() => new Cookies(), []);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const token = cookies.get("token");

    if (token) {
      navigate("/dashboard", { replace: true });
    } else {
      setIsAuthChecked(true);
    }
  }, [cookies, navigate]); // No warning, cookies is stable now

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok || !data.token) {
        throw new Error(data.message || "Invalid credentials");
      }

      cookies.set("token", data.token);
      cookies.set("username", data.username);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    }
  };

  if (!isAuthChecked) {
    return null;
  }

  return (
    <div className="flex justify-center items-center">
    <div className="bg-white shadow-md rounded px-8 py-6 max-w-sm w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      {error && <p className="text-red-500 text-center mb-3">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 mb-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 mb-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-800 cursor-pointer">
          Login
        </button>
      </form>
  
      <p className="mt-3 text-center">
        Don't have an account?{" "}
        <a href="/signup" className="text-blue-600">Sign up</a>
      </p>
    </div>
  </div>
  
  );
};

export default Login;
