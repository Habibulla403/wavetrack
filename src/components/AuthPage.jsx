import { useState } from "react";
import { login, register } from "../api";
import { useNavigate } from "react-router-dom";

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/>
    </svg>
  );
}

export default function AuthPage({ onAuth }) {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = async () => {
    if (loading) return;
    setError("");

    // ✅ Validation
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }

    if (!isLogin && !form.name) {
      setError("Name is required");
      return;
    }

    if (!isLogin && form.password !== form.confirm) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const data = isLogin
        ? await login({ email: form.email, password: form.password })
        : await register({ name: form.name, email: form.email, password: form.password });

      if (data.token) {
        // ✅ Secure storage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email
        }));

        onAuth(data);

        // ✅ Redirect
        navigate("/dashboard");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Network error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A0A0F] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">WaveTrack</h1>
          <p className="text-white/50 text-lg max-w-sm">
            Distribute your music worldwide 🚀
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isLogin ? "Sign in" : "Create account"}
          </h2>

          <p className="text-gray-500 text-sm mb-6">
            {isLogin ? "Welcome back!" : "Start your journey"}
          </p>

          <div className="space-y-4">

            {!isLogin && (
              <input
                disabled={loading}
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border px-4 py-3 rounded-xl"
              />
            )}

            <input
              disabled={loading}
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border px-4 py-3 rounded-xl"
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                disabled={loading}
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border px-4 py-3 rounded-xl pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <EyeIcon open={showPass} />
              </button>
            </div>

            {/* CONFIRM */}
            {!isLogin && (
              <div className="relative">
                <input
                  disabled={loading}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  className="w-full border px-4 py-3 rounded-xl pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
            )}

            {/* ERROR */}
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              onClick={handle}
              disabled={loading}
              className="w-full bg-emerald-500 text-white py-3 rounded-xl"
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
            </button>
          </div>

          <p className="text-center text-sm mt-6">
            {isLogin ? "No account?" : "Already have one?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-emerald-600 ml-2"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
