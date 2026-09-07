import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Login() {
  const [email,setEmail]=useState(''); const [senha,setSenha]=useState(''); const [erro,setErro]=useState(''); const [carregando,setCarregando]=useState(false); const navegar=useNavigate();
  async function entrar(e){ e.preventDefault(); setErro(''); setCarregando(true); try { const dados=await api.login({email,senha}); localStorage.setItem('estoquefacil_token',dados.token); localStorage.setItem('estoquefacil_usuario',JSON.stringify(dados.usuario)); navegar('/'); } catch(e){setErro(e.message);} finally{setCarregando(false);} }
  return <div className="tela-login"><form className="cartao-login" onSubmit={entrar}><h1 style={{marginBottom:4}}>EstoqueFácil</h1><p style={{color:'var(--cor-texto-suave)',marginTop:0,marginBottom:20,fontSize:'0.9rem'}}>Controle de estoque e vendas</p>{erro&&<div className="mensagem-erro">{erro}</div>}<div className="form-linha"><label>E-mail</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="username" /></div><div className="form-linha"><label>Senha</label><input type="password" value={senha} onChange={e=>setSenha(e.target.value)} required autoComplete="current-password" /></div><button disabled={carregando} className="botao" style={{width:'100%',marginTop:8}}>{carregando?'Entrando...':'Entrar'}</button><small style={{display:'block',marginTop:14,color:'var(--cor-texto-suave)'}}>Acesso inicial: admin@estoquefacil.com / 123456</small></form></div>;
}
