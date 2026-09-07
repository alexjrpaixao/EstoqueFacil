import { useEffect, useState } from 'react';
const VAZIO={nome:'',codigo:'',categoria_id:'',preco_custo:'',preco_venda:'',estoque:'',estoque_minimo:''};
import { api } from '../services/api';
const moeda=v=>Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
export default function Produtos(){
 const [produtos,setProdutos]=useState([]),[categorias,setCategorias]=useState([]),[form,setForm]=useState(VAZIO),[editando,setEditando]=useState(null),[erro,setErro]=useState(''),[busca,setBusca]=useState(''),[ok,setOk]=useState('');
 const carregar=async(t='')=>{try{setProdutos(await api.listarProdutos(t?`?busca=${encodeURIComponent(t)}`:''));}catch(e){setErro(e.message)}};
 useEffect(()=>{carregar();api.listarCategorias().then(setCategorias).catch(()=>{});},[]);
 const campo=(k,v)=>setForm(f=>({...f,[k]:v}));
 async function salvar(e){e.preventDefault();setErro('');setOk('');try{const dados={...form,categoria_id:form.categoria_id||null,preco_custo:Number(form.preco_custo||0),preco_venda:Number(form.preco_venda||0),estoque:Number(form.estoque||0),estoque_minimo:Number(form.estoque_minimo||0)};if(editando){await api.atualizarProduto(editando.id,{...dados,estoque:undefined});setOk('Produto atualizado com sucesso.');}else{await api.criarProduto(dados);setOk('Produto cadastrado com sucesso.');}setForm(VAZIO);setEditando(null);carregar(busca);}catch(e){setErro(e.message)}}
 function editar(p){setEditando(p);setForm({nome:p.nome,codigo:p.codigo,categoria_id:p.categoria_id||'',preco_custo:p.preco_custo,preco_venda:p.preco_venda,estoque:'',estoque_minimo:p.estoque_minimo});window.scrollTo({top:0,behavior:'smooth'});}
 async function excluir(id){if(!confirm('Remover este produto?'))return;try{await api.removerProduto(id);carregar(busca);setOk('Produto removido.')}catch(e){setErro(e.message)}}
 return <div><div className="cabecalho-pagina"><h1>Produtos</h1><input placeholder="Buscar por nome ou código" value={busca} onChange={e=>{setBusca(e.target.value);carregar(e.target.value)}} style={{padding:'8px 10px',border:'1px solid var(--cor-borda)',borderRadius:6,width:240}}/></div>{erro&&<div className="mensagem-erro">{erro}</div>}{ok&&<div className="cartao" style={{marginBottom:20}}>{ok}</div>}
 <div className="cartao" style={{marginBottom:24}}><h2>{editando?'Editar produto':'Novo produto'}</h2><form onSubmit={salvar} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 20px'}}>
 {['nome','codigo'].map(k=><div className="form-linha" key={k}><label>{k==='nome'?'Nome':'Código'}</label><input value={form[k]} onChange={e=>campo(k,e.target.value)} required/></div>)}
 <div className="form-linha"><label>Categoria</label><select value={form.categoria_id} onChange={e=>campo('categoria_id',e.target.value)}><option value="">Sem categoria</option>{categorias.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
 <div className="form-linha"><label>Preço de custo (R$)</label><input type="number" step="0.01" min="0" value={form.preco_custo} onChange={e=>campo('preco_custo',e.target.value)}/></div>
 <div className="form-linha"><label>Preço de venda (R$)</label><input type="number" step="0.01" min="0" value={form.preco_venda} onChange={e=>campo('preco_venda',e.target.value)} required/></div>
 {!editando&&<div className="form-linha"><label>Estoque inicial</label><input type="number" min="0" step="1" value={form.estoque} onChange={e=>campo('estoque',e.target.value)}/></div>}
 <div className="form-linha"><label>Estoque mínimo</label><input type="number" min="0" step="1" value={form.estoque_minimo} onChange={e=>campo('estoque_minimo',e.target.value)}/></div>
 <div style={{gridColumn:'1/-1'}}><button className="botao">{editando?'Salvar alterações':'Salvar produto'}</button>{editando&&<button type="button" className="botao secundario" style={{marginLeft:8}} onClick={()=>{setEditando(null);setForm(VAZIO)}}>Cancelar</button>}</div></form></div>
 <div className="cartao"><table><thead><tr><th>Código</th><th>Nome</th><th>Categoria</th><th>Preço venda</th><th>Estoque</th><th>Ações</th></tr></thead><tbody>{produtos.map(p=><tr key={p.id}><td>{p.codigo}</td><td>{p.nome}</td><td>{p.categoria_nome||'—'}</td><td>{moeda(p.preco_venda)}</td><td className={p.estoque<=p.estoque_minimo?'selo-baixo':''}>{p.estoque}</td><td><button className="botao secundario" onClick={()=>editar(p)}>Editar</button> <button className="botao secundario" onClick={()=>excluir(p.id)}>Remover</button></td></tr>)}{!produtos.length&&<tr><td colSpan="6">Nenhum produto cadastrado ainda.</td></tr>}</tbody></table></div></div>;
}
