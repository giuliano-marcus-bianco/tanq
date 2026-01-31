function PostoList({ postos, onDelete }) {
  if (!postos || postos.length === 0) {
    return (
      <div className="empty-state">
        <p>Nenhum posto encontrado.</p>
      </div>
    );
  }

  return (
    <div className="posto-list">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Posto</th>
            <th>Endereço</th>
            <th>Gasolina</th>
            <th>Etanol</th>
            <th>Diesel</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {postos.map((posto, index) => (
            <tr key={posto.id}>
              <td className="ranking-position">{index + 1}º</td>
              <td className="posto-nome">{posto.nome}</td>
              <td>{posto.endereco || '-'}</td>
              <td className="preco">
                {posto.precoGasolina 
                  ? `R$ ${Number(posto.precoGasolina).toFixed(2)}` 
                  : '-'}
              </td>
              <td className="preco">
                {posto.precoEtanol 
                  ? `R$ ${Number(posto.precoEtanol).toFixed(2)}` 
                  : '-'}
              </td>
              <td className="preco">
                {posto.precoDiesel 
                  ? `R$ ${Number(posto.precoDiesel).toFixed(2)}` 
                  : '-'}
              </td>
              <td className="acoes">
                <button 
                  className="btn btn-danger btn-small"
                  onClick={() => onDelete(posto.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PostoList;
