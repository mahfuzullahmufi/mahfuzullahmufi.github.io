import { useState } from 'react';
import {
  LoginContainer, LoginCard, LoginTitle, LoginSubtitle,
  Input, LoginButton, ErrorText,
} from './AdminStyles';

export default function LoginForm({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const adminPwd = import.meta.env.VITE_ADMIN_PASSWORD;
    if (password === adminPwd) {
      sessionStorage.setItem('admin-auth', 'true');
      onLogin();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>Portfolio Admin</LoginTitle>
        <LoginSubtitle>Enter your password to manage content</LoginSubtitle>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            autoFocus
          />
          {error && <ErrorText>{error}</ErrorText>}
          <LoginButton type="submit">Login</LoginButton>
        </form>
      </LoginCard>
    </LoginContainer>
  );
}
