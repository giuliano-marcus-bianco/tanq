import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { postoService, precoService } from '../services/api';
import L, { defaultIcon } from '../utils/leafletConfig';

// Botão para ir à localização do usuário
function BotaoLocalizacao({ posicaoUsuario }) {
  const map = useMap();

  function irParaMinhaLocalizacao() {
    if (posicaoUsuario) {
      map.setView(posicaoUsuario, 15);
    } else {
      // Tentar obter localização se não tiver
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            map.setView([position.coords.latitude, position.coords.longitude], 15);
          },
          () => {
            alert('Não foi possível obter sua localização.');
          }
        );
      }
    }
  }

  return (
    <button 
      className="btn-minha-localizacao"
      onClick={irParaMinhaLocalizacao}
      title="Ir para minha localização"
    >
      📍
    </button>
  );
}

// Formata o endereço para exibição
function getEnderecoFormatado(posto) {
  const partes = [];
  if (posto.rua) {
    let end = posto.rua;
    if (posto.numero) end += ', ' + posto.numero;
    partes.push(end);
  }
  if (posto.bairro) partes.push(posto.bairro);
  if (posto.cidade) partes.push(posto.cidade);
  return partes.join(' - ') || 'Endereço não informado';
}

function MapaPostos({ height = '500px' }) {
  const [postos, setPostos] = useState([]);
  const [precos, setPrecos] = useState({});
  const [posicaoUsuario, setPosicaoUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Posição padrão (Florianópolis)
  const posicaoPadrao = [-27.5969, -48.5480];

  useEffect(() => {
    carregarDados();
    obterLocalizacao();
  }, []);

  async function carregarDados() {
    try {
      const [postosResponse, precosResponse] = await Promise.all([
        postoService.listarTodos(),
        precoService.listarTodos()
      ]);
      
      setPostos(postosResponse.data.filter(p => p.latitude && p.longitude));
      
      // Agrupar preços por posto
      const precosMap = {};
      precosResponse.data.forEach(preco => {
        if (!precosMap[preco.postoId]) {
          precosMap[preco.postoId] = {};
        }
        precosMap[preco.postoId][preco.tipoCombustivel] = preco.valor;
      });
      setPrecos(precosMap);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  function obterLocalizacao() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosicaoUsuario([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn('Não foi possível obter localização:', error);
        }
      );
    }
  }

  if (loading) {
    return <div className="loading">Carregando mapa...</div>;
  }

  return (
    <div className="mapa-container" style={{ position: 'relative' }}>
      <MapContainer
        center={posicaoUsuario || posicaoPadrao}
        zoom={12}
        style={{ height: height, width: '100%', borderRadius: '12px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <BotaoLocalizacao posicaoUsuario={posicaoUsuario} />

        {postos.map((posto) => (
          <Marker key={posto.id} position={[posto.latitude, posto.longitude]} icon={defaultIcon}>
            <Popup>
              <div className="popup-content">
                <h4>{posto.nome}</h4>
                <p className="popup-endereco">{getEnderecoFormatado(posto)}</p>
                <div className="popup-precos">
                  {precos[posto.id]?.GASOLINA && (
                    <span className="popup-preco">
                      ⛽ Gasolina: R$ {Number(precos[posto.id].GASOLINA).toFixed(2)}
                    </span>
                  )}
                  {precos[posto.id]?.ETANOL && (
                    <span className="popup-preco">
                      🌿 Etanol: R$ {Number(precos[posto.id].ETANOL).toFixed(2)}
                    </span>
                  )}
                  {precos[posto.id]?.DIESEL && (
                    <span className="popup-preco">
                      🛢️ Diesel: R$ {Number(precos[posto.id].DIESEL).toFixed(2)}
                    </span>
                  )}
                  {!precos[posto.id] && (
                    <span className="popup-sem-preco">Sem preços cadastrados</span>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {postos.length === 0 && (
        <p className="mapa-aviso">
          Nenhum posto com coordenadas cadastradas.
        </p>
      )}
    </div>
  );
}

export default MapaPostos;
