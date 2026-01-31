import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L, { defaultIcon } from '../utils/leafletConfig';

// Componente para mover o mapa quando a posição muda
function MoveMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 16);
    }
  }, [position, map]);
  return null;
}

// Componente para capturar cliques no mapa
function ClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function SeletorLocalizacao({ onLocationChange, enderecoBusca = '', posicaoInicial = null }) {
  const [position, setPosition] = useState(posicaoInicial);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  // Posição padrão (Florianópolis)
  const posicaoPadrao = [-27.5969, -48.5480];

  // Geocoding usando Nominatim (OpenStreetMap)
  async function buscarEndereco() {
    if (!enderecoBusca.trim()) {
      setErro('Preencha os campos de endereço primeiro.');
      return;
    }

    setBuscando(true);
    setErro('');
    setMensagem('');

    try {
      const query = encodeURIComponent(enderecoBusca + ', Brasil');
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPosition = [parseFloat(lat), parseFloat(lon)];
        setPosition(newPosition);
        onLocationChange({
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        });
        setMensagem('Localização encontrada! Verifique no mapa se está correto.');
      } else {
        setErro('Endereço não encontrado. Clique diretamente no mapa para selecionar.');
      }
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      setErro('Erro ao buscar endereço. Clique diretamente no mapa.');
    } finally {
      setBuscando(false);
    }
  }

  // Quando o usuário clica no mapa
  function handleMapClick(newPosition) {
    setPosition(newPosition);
    setMensagem('Localização selecionada no mapa.');
    setErro('');
    onLocationChange({
      latitude: newPosition[0],
      longitude: newPosition[1],
    });
  }

  // Obter localização atual do usuário
  function usarMinhaLocalizacao() {
    if (navigator.geolocation) {
      setBuscando(true);
      setErro('');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPosition = [pos.coords.latitude, pos.coords.longitude];
          setPosition(newPosition);
          onLocationChange({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setMensagem('Localização atual obtida!');
          setBuscando(false);
        },
        (error) => {
          setErro('Não foi possível obter sua localização.');
          setBuscando(false);
        }
      );
    } else {
      setErro('Geolocalização não suportada pelo navegador.');
    }
  }

  return (
    <div className="seletor-localizacao">
      <div className="busca-endereco">
        <button 
          type="button"
          onClick={buscarEndereco} 
          disabled={buscando}
          className="btn btn-buscar-mapa"
        >
          {buscando ? 'Buscando...' : '🔍 Buscar no Mapa'}
        </button>
        <button 
          type="button"
          onClick={usarMinhaLocalizacao}
          disabled={buscando}
          className="btn btn-localizacao"
        >
          📍 Usar minha localização
        </button>
      </div>

      {erro && <p className="erro-localizacao">{erro}</p>}
      {mensagem && <p className="mensagem-localizacao">{mensagem}</p>}

      <p className="instrucao-mapa">
        Clique no mapa para ajustar a localização exata do posto.
      </p>

      <MapContainer
        center={position || posicaoPadrao}
        zoom={position ? 16 : 13}
        style={{ height: '300px', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />
        <ClickHandler onLocationSelect={handleMapClick} />
        <MoveMap position={position} />
        {position && <Marker position={position} icon={defaultIcon} />}
      </MapContainer>

      {position && (
        <p className="coordenadas-selecionadas">
          ✅ Localização: {position[0].toFixed(4)}, {position[1].toFixed(4)}
        </p>
      )}
    </div>
  );
}

export default SeletorLocalizacao;
