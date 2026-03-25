import { useState } from 'react';
import axios from 'axios';
import schoolLogo from "../assets/school-logo.webp";
import Button from '../components/shared/button';
import Input from '../components/shared/input';


const Login = () => {
  const [matricNumber, setMatricNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log(matricNumber, password);
      
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        matricNumber,
        password,
      });

      // Save token & user to localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      

      // Redirect based on role - use window.location to force a full page reload
      const role = res.data.user.role;
      const destination = `/${role}-dashboard`;
      window.location.href = destination;
    } catch (err) {
      setError((err as any).response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-contain bg-center"
      style={{ backgroundImage: `url(${schoolLogo})` }}
    >
      <div className="absolute inset-0 bg-secondary/50"></div>
      <div className="relative bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md">
     
        <h2 className="text-3xl font-bold text-center mb-4 text-primary text-shadow ">
          Smart Campus Transport
        </h2>
        <h3 className="text-2xl text-center mb-8 text-[#99999] font-bold">Login</h3>

        {error && <p className="text-red-200 bg-red-700 bg-opacity-50 rounded-md p-2 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Matric Number"
            type="text"
            value={matricNumber}
            onChange={(e) => setMatricNumber(e.target.value.toUpperCase())}
            placeholder="e.g. SAZUG/2023/12345"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Default: 123456789"
            required
          />

          <Button type="submit" loading={loading}>
            Login
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-[#99999] font-bold">
          Use matric number and default password: <strong>123456789</strong>
        </p>
      </div>
    </div>
  );
};

export default Login;