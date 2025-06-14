import { useState, type FormEvent } from "react";
import { useAuth } from "./auth-context";
import TheForm from "../../components/UI/form";
import { Navigate, useNavigate } from "react-router-dom";
import { client, setAuthorizationHeader } from "../../api/client";
import storage from "../../utils/storage";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [rememberUser, setRememberUser] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { isLogged, onLogin } = useAuth();

  if (isLogged) {
    return <Navigate to="/adverts" replace />;
  }

  //desestructurando
  const { email, password } = credentials;
  const disabled = !email || !password;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const response = await client.post("/api/auth/login", {
        email,
        password,
      });
      const token = response.data.accessToken;
      storage.set("auth", token);

      if (rememberUser) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      setAuthorizationHeader(token);
      onLogin();
      navigate("/adverts");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Login on Nodepop
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <TheForm
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                        placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              label="email"
              type="email"
              value={email}
              onChange={(event) =>
                setCredentials((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
              required
            />
            <br />
            <TheForm
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                        placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              label="password"
              type="password"
              value={password}
              onChange={(event) =>
                setCredentials((prev) => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
              required
            />
          </div>
          <label>
            <input
              type="checkbox"
              checked={rememberUser}
              onChange={(event) => setRememberUser(event.target.checked)}
              className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">Remember me</span>
          </label>
          <button type="submit" disabled={disabled}
           className="
              w-full
              inline-flex
              justify-center
              py-3
              px-4
              border
              border-transparent
              rounded-md
              shadow-sm
              text-lg
              font-semibold
              text-white
              bg-indigo-600
              hover:bg-indigo-800
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-indigo-500
              transition-colors duration-200
            ">
            Login
          </button>
          {error && <p>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
