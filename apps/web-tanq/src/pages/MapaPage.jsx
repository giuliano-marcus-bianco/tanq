import MapaPostos from '../components/MapaPostos';

function MapaPage() {
  return (
    <div className="mapa-page">
      <h2>🗺️ Mapa de Postos</h2>
      <p className="mapa-descricao">
        Visualize os postos de combustível próximos a você com seus preços atualizados.
      </p>
      <MapaPostos />
    </div>
  );
}

export default MapaPage;
