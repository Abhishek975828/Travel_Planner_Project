import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register(name, email, password);
      navigate("/trips");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form-page">
      <h2>Register</h2>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

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
            minLength={6}
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Creating account..." : "Register"}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;