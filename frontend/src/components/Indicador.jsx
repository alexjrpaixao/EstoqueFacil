export default function Indicador({ rotulo, valor, alerta }) {
  return (
    <div className={`cartao indicador ${alerta ? 'alerta' : ''}`}>
      <div className="rotulo">{rotulo}</div>
      <div className="valor">{valor}</div>
    </div>
  );
}
