import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { icons } from "@/lib/icons";
import { useAuth } from "@/hooks/useAuth";
import wayamMarkLight from "@/assets/brand/wayam-mark-light.svg";
import wayamMarkDark from "@/assets/brand/wayam-mark-dark.svg";
import wayamWordmarkLight from "@/assets/brand/wayam-wordmark-light.svg";
import wayamWordmarkDark from "@/assets/brand/wayam-wordmark-dark.svg";

const field =
  "h-11 w-full rounded-full border border-hairline bg-action px-4 pl-10 type-body-md text-foreground outline-none transition-colors duration-[180ms] placeholder:text-quaternary hover:border-strong focus-visible:border-strong focus-visible:ring-2 focus-visible:ring-active";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Enter any email and password to continue.");
      return;
    }
    login(email.trim());
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-page">
      {/* Brand panel (solid, no hero image): near-black in light mode, near-white in dark mode */}
      <div className="hidden flex-[1.4] flex-col justify-between bg-action-primary p-10 text-on-color lg:flex">
        <div className="flex items-center gap-2.5">
          <img src={wayamMarkLight} alt="" className="h-auto w-8 shrink-0 dark:hidden" />
          <img src={wayamMarkDark} alt="" className="hidden h-auto w-8 shrink-0 dark:block" />
          <span className="flex flex-col gap-0.5">
            <img src={wayamWordmarkDark} alt="Wayam AI" className="h-5 w-auto self-start dark:hidden" />
            <img src={wayamWordmarkLight} alt="Wayam AI" className="hidden h-5 w-auto self-start dark:block" />
          </span>
        </div>
        <p className="type-display-2xl">PlantMind</p>
      </div>

      {/* Form column */}
      <div className="flex w-full flex-col border-l border-hairline bg-container lg:w-[min(28rem,42%)]">
        <div className="flex items-center gap-2.5 px-8 pt-8 lg:hidden">
          <img src={wayamMarkLight} alt="" className="h-auto w-8 shrink-0 dark:hidden" />
          <img src={wayamMarkDark} alt="" className="hidden h-auto w-8 shrink-0 dark:block" />
          <span className="flex flex-col gap-0.5">
            <img src={wayamWordmarkLight} alt="Wayam AI" className="h-5 w-auto self-start dark:hidden" />
            <img src={wayamWordmarkDark} alt="Wayam AI" className="hidden h-5 w-auto self-start dark:block" />
            <span className="type-eyebrow text-quaternary">PlantMind</span>
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center px-8 py-10">
          <h1 className="type-display-xl text-foreground">Sign in</h1>
          <p className="type-body-md mt-2 text-tertiary">
            Demo build. Enter any email and password to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="type-eyebrow text-quaternary">
                Email
              </label>
              <div className="relative">
                <icons.email className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-icon-quaternary" aria-hidden />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={field}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="type-eyebrow text-quaternary">
                Password
              </label>
              <div className="relative">
                <icons.password className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-icon-quaternary" aria-hidden />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${field} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-quaternary outline-none transition-colors duration-[180ms] hover:text-foreground focus-visible:ring-2 focus-visible:ring-active"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <icons.hidePassword className="size-4" aria-hidden /> : <icons.showPassword className="size-4" aria-hidden />}
                </button>
              </div>
            </div>

            {error && <p className="type-body-sm text-error">{error}</p>}

            <button
              type="submit"
              className="type-label-md mt-1 h-11 w-full rounded-full bg-action-primary text-on-color outline-none transition-colors duration-[180ms] hover:bg-action-primary-hover focus-visible:ring-2 focus-visible:ring-active"
            >
              Sign in
            </button>
          </form>
        </div>

        <p className="type-caption px-8 pb-8 text-quaternary">
          Wayam AI · PlantMind demo environment
        </p>
      </div>
    </div>
  );
};

export default Login;
