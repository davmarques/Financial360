// src/pages/Auth.jsx
import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';

const Auth = ({ onSession }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            },
          },
        });
        if (error) throw error;
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4F0] flex flex-col md:flex-row p-4 md:p-5 gap-0">
      {/* Sidebar/Image Section */}
      <div className="md:w-[35%] bg-[#201F24] rounded-2xl p-10 flex flex-col justify-between text-white relative overflow-hidden min-h-[300px] md:min-h-auto">
        <div className="z-10 animate-fadeIn">
            <h1 className="text-4xl font-bold tracking-tight">financial360</h1>
        </div>
        
        <div className="z-10 max-w-sm animate-modalEnter" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-3xl font-bold mb-6 leading-[1.2]">
            Keep track of your money and save for your future
          </h2>
          <p className="text-[#98908B] text-sm leading-relaxed">
            Personal finance app puts you in control of your spending. Track transactions, set budgets, and save to reach your goals.
          </p>
        </div>

        {/* Decorative Element - Large Ring */}
        <div className="absolute -bottom-10 -left-10 w-80 h-80 border-[50px] border-white/5 rounded-full pointer-events-none"></div>
        <div className="absolute top-20 -right-10 w-40 h-40 border-[20px] border-white/5 rounded-full pointer-events-none"></div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-[#F8F4F0]">
        <div className="w-full max-w-[560px] animate-fadeIn">
          <Card className="bg-white p-8 md:p-14 shadow-[0_4px_24px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
            <h1 className="text-[32px] font-bold text-[#201F24] mb-8 tracking-tight">
              {isLogin ? 'Login' : 'Sign Up'}
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {!isLogin && (
                <div className="animate-modalEnter">
                  <Input
                    id="name"
                    label="Name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              
              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <div>
                <Input
                  id="password"
                  type="password"
                  label="Password"
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {isLogin && (
                  <div className="flex justify-end mt-2">
                    <button type="button" className="text-xs text-[#696868] hover:text-[#201F24] transition-colors">
                      Forgot Password?
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-4 bg-[#FFB3B3]/10 text-[#C94736] text-sm rounded-xl border border-[#C94736]/20 animate-fadeIn flex items-start gap-3">
                  <span>{error}</span>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className="mt-2 py-4 shadow-lg shadow-black/10 active:scale-[0.98] transition-all"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (isLogin ? 'Login' : 'Create Account')}
              </Button>

              <div className="text-center pt-2">
                <span className="text-sm text-[#696868]">
                  {isLogin ? "Need to create an account?" : "Already have an account?"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                  }}
                  className="ml-2 text-sm font-bold text-[#201F24] underline underline-offset-4 hover:text-[#4D4B54] transition-colors"
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
