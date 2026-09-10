import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate("/trips");
    } catch (err) {
      // Backend sends { message: "..." } on failure
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form-page">
      <h2>Login</h2>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;