import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      if (!response.ok) {
        const responseText = await response.text(); // Get the raw response text
        let errorData = {};
        try {
          errorData = JSON.parse(responseText); // Try parsing JSON if it's available
        } catch (err) {
          errorData = { message: responseText || "An error occurred" }; // Fallback if no valid JSON
        }
        finally {
          setLoading(false); // Stop loader
        }
  
        throw new Error(errorData.message || "Signup failed");
      }
  
      setSuccess("Signup successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login"); // Redirect to login after successful signup
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };
  
  

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white shadow-md rounded px-8 py-6 max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        {error && <p className="text-red-500 text-center mb-3">{error}</p>}
        {success && <p className="text-green-500 text-center mb-3">{success}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            className="w-full px-3 py-2 mb-3 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-800 cursor-pointer">
          {loading ? (
            <h2>Signing up... Please wait</h2>
          ) : (
            "Sign Up"
          )}
          </button>
        </form>
        <p className="mt-3 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
