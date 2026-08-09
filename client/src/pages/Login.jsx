import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Chrome } from 'lucide-react';
import AuthSidebar from '../components/AuthSidebar';
import Button from '../components/Button';
import Input from '../components/Input';
import ErrorMessage from '../components/ErrorMessage';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!email.trim() || !password) {
      setError('Please enter your email and password');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/home');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not sign in. Please try again.'));
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-canvas">
      <AuthSidebar
        title={<>Keep every item counted. <span className="text-primary-light">Effortlessly.</span></>}
        subtitle="A simple, modern way to manage your stock — from first item to final sale."
      />

      <div className="flex w-full flex-col px-6 py-8 sm:px-12 lg:w-[46%] lg:px-16 xl:px-20">
        <div className="lg:hidden">
          <Logo />
        </div>

        <div className="flex flex-1 flex-col justify-center py-8">
          <div className="w-full max-w-md">
            <p className="text-sm font-medium tracking-wide text-primary">Welcome back.</p>
            <h1 className="heading-display mt-3 text-4xl sm:text-5xl">Sign in to your account</h1>
            <p className="mt-3 text-dark-soft">Enter your details to access your inventory.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
              <Input
                id="login-email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div>
                <div className="relative">
                  <Input
                    id="login-password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="!pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-[42px] text-dark-muted transition-colors hover:text-dark"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" aria-hidden="true" /> : <Eye className="h-4.5 w-4.5" aria-hidden="true" />}
                  </button>
                </div>
                <div className="mt-2 flex justify-end">
                  <span className="text-xs text-dark-muted">Forgot password?</span>
                </div>
              </div>

              {error && <ErrorMessage message={error} />}

              <Button type="submit" fullWidth size="lg" loading={loading} disabled={loading}>
                SIGN IN
                {!loading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
              <span className="text-xs uppercase tracking-widest text-dark-muted">or</span>
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
            </div>

            <button
              type="button"
              onClick={() => {
                setError('Google sign-in is not available in this demo. Use email to sign in.');
              }}
              className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-white text-sm font-medium text-dark transition-colors hover:border-primary"
            >
              <Chrome className="h-5 w-5" aria-hidden="true" />
              Continue with Google
            </button>

            <p className="mt-8 text-center text-sm text-dark-soft">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-primary hover:text-primary-dark">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
