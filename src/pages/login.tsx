        import React, { useState } from "react";
        import { Link, useNavigate } from "react-router-dom";
        import '../login.css';

        const Login: React.FC = () => {
        const [email, setEmail] = useState('');
        const [password_hash, setPassword] = useState('');
        const [error, setError] = useState('');
        const navigate = useNavigate();

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (!email || !password_hash) {
            setError('Por favor, preencha todos os campos.');
            return;
            }

            try {
                const res = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password_hash })
                })

                const data = await res.json()

                if(!res.ok){
                    setError(data.message || 'Erro ao fazer login.');
                    return
                }

                localStorage.setItem('token', data.Login.token)
                localStorage.setItem('name_user', data.Login.user.name_user)
                localStorage.setItem('id_user', data.Login.user.id_user.toString())

                navigate('/home')

                console.log('Login bem-sucedido:', data);

            } catch (error  ) {
                setError('Erro ao fazer login. Tente novamente.'); 
            }


        }

        return (
            <div className="login-page">
                <section className="img-container">
                    <img src="/imgLogin.jpg" alt="Imagem de Login"/>
                </section>
                <div className="login-container">
                <form onSubmit={handleSubmit}>
                <h2>Bem-vindo de volta!</h2>
                <h5>Acesse sua conta e organize suas tarefas.</h5>
                    <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                    <input
                    type="password"
                    placeholder="Senha"
                    value={password_hash}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Entrar</button>
                    <p>Não tem uma conta? <Link to="/register">Registre-se</Link></p>
                </form>
                </div>
            </div>
        );
        }

        export default Login;
