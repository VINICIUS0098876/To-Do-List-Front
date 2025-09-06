import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../register.css';


const Register: React.FC = () => {
    const [name_user, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password_hash, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name_user || !email || !password_hash) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name_user, email, password_hash })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Erro ao registrar.');
                return;
            }


            navigate('/');

            console.log('Registro bem-sucedido:', data);

        } catch (error) {
            setError('Erro ao registrar. Tente novamente.');
        }
    }

    return(
        <div className="login-page">
                <section className="img-container">
                    <img src="/imgLogin.jpg" alt="Imagem de Login"/>
                </section>
                <div className="login-container">
                  <form onSubmit={handleSubmit}>
                  <h2>Bem-vindo!</h2>
                  <h5>Crie já sua conta e organize suas tarefas!</h5>
                  <input
                      type="text"
                      placeholder="Nome"
                      value={name_user}
                      onChange={(e) => setNome(e.target.value)}
                    //  required
                    />
                    <input
                      type="email"
                      placeholder="E-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                     // required
                    />
                    <input
                      type="password"
                      placeholder="Senha"
                      value={password_hash}
                      onChange={(e) => setPassword(e.target.value)}
                    //   required
                    />
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Cadastrar</button>
                    <p>Já tem uma conta? <Link to="/">Faça login</Link></p>
                  </form>
                </div>
            </div>
    )
}


export default Register;