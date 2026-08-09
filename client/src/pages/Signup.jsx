import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import AuthSidebar from '../components/AuthSidebar';
import Button from '../components/Button';
import Input from '../components/Input';
import ErrorMessage from '../components/ErrorMessage';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

const Signup = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (name.trim().length < 2) next.name = 'Name must be at least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = 'Enter a valid email address';
    if (password.length < 6) next.password = 'Password must be at least 6 characters';
    if (confirmPassword !== password) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    setError('');
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate('/home');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create your account. Please try again.'));
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-canvas">
      <AuthSidebar
        title={<>Your inventory. <span className="text-primary-light">Your rules.</span></>}
        subtitle="Create a free account and take control of your stock in minutes."
      />

      <div className="flex w-full flex-col px-6 py-8 sm:px-12 lg:w-[46%] lg:px-16 xl:px-20">
        <div className="lg:hidden">
          <Logo />
        </div>

        <div className="flex flex-1 flex-col justify-center py-8">
          <div className="w-full max-w-md">
            <p className="text-sm font-medium tracking-wide text-primary">Create account.</p>
            <h1 className="heading-display mt-3 text-4xl sm:text-5xl">Get started today</h1>
            <p className="mt-3 text-dark-soft">It only takes a minute to set up your account.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
              <Input
                id="signup-name"
                label="Full Name"
                autoComplete="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
              />
              <Input
                id="signup-email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
              <div className="relative">
                <Input
                  id="signup-password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
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
              <Input
                id="signup-confirm"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
              />

              {error && <ErrorMessage message={error} />}

              <Button type="submit" fullWidth size="lg" loading={loading} disabled={loading}>
                CREATE ACCOUNT
                {!loading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-dark-soft">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
