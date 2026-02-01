import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, ActivityIndicator, Chip, Card, Button } from 'react-native-paper';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { useFocusEffect } from 'expo-router';
import { postoService, precoService } from '../../../../libs/core-logic/src/services/api';
import type { Posto, Preco } from '../../../../libs/core-logic/src/types';
import { tanqColors } from '../../theme';

interface PostoComPrecos extends Posto {
  precos: Record<string, number>;
}

const { width, height } = Dimensions.get('window');

// Região inicial - Florianópolis, SC
const INITIAL_REGION = {
  latitude: -27.5954,
  longitude: -48.5480,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

export default function MapScreen() {
  const [postos, setPostos] = useState<PostoComPrecos[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [selectedPosto, setSelectedPosto] = useState<PostoComPrecos | null>(null);

  const carregarDados = async () => {
    try {
      setErro('');
      const [postosRes, precosRes] = await Promise.all([
        postoService.listarTodos(),
        precoService.listarTodos(),
      ]);

      // Agrupar preços por posto
      const precosPorPosto: Record<number, Record<string, number>> = {};
      precosRes.data.forEach((preco: Preco) => {
        if (!precosPorPosto[preco.postoId]) {
          precosPorPosto[preco.postoId] = {};
        }
        precosPorPosto[preco.postoId][preco.tipo] = preco.valor;
      });

      // Combinar postos com preços (filtrar apenas os que têm coordenadas)
      const postosComPrecos = postosRes.data
        .filter((posto: Posto) => posto.latitude && posto.longitude)
        .map((posto: Posto) => ({
          ...posto,
          precos: precosPorPosto[posto.id] || {},
        }));

      setPostos(postosComPrecos);
    } catch (error: any) {
      console.error('Erro ao carregar postos:', error);
      if (error.message?.includes('Network')) {
        setErro('Sem conexão. Verifique sua internet.');
      } else {
        setErro('Erro ao carregar mapa.');
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const formatarPreco = (valor: number | undefined) => {
    if (!valor) return '-';
    return `R$ ${valor.toFixed(2)}`;
  };

  const getMenorPreco = (precos: Record<string, number>) => {
    const valores = Object.values(precos);
    if (valores.length === 0) return null;
    return Math.min(...valores);
  };

  const getCorMarcador = (posto: PostoComPrecos) => {
    const menor = getMenorPreco(posto.precos);
    if (!menor) return '#999'; // Cinza se não tem preço
    if (menor < 5.5) return tanqColors.primary; // Verde para barato
    if (menor < 6.0) return tanqColors.secondary; // Amarelo para médio
    return '#F44336'; // Vermelho para caro
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={tanqColors.primary} />
        <Text style={styles.loadingText}>Carregando mapa...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.erroText}>{erro}</Text>
        <Button mode="contained" onPress={carregarDados} style={{ marginTop: 16 }}>
          Tentar novamente
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
      >
        {postos.map((posto) => (
          <Marker
            key={posto.id}
            coordinate={{
              latitude: posto.latitude!,
              longitude: posto.longitude!,
            }}
            pinColor={getCorMarcador(posto)}
            onPress={() => setSelectedPosto(posto)}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{posto.nome}</Text>
                {posto.precos.GASOLINA && (
                  <Text style={styles.calloutPreco}>
                    Gasolina: {formatarPreco(posto.precos.GASOLINA)}
                  </Text>
                )}
                {posto.precos.ETANOL && (
                  <Text style={styles.calloutPreco}>
                    Etanol: {formatarPreco(posto.precos.ETANOL)}
                  </Text>
                )}
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Legenda */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Legenda</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: tanqColors.primary }]} />
            <Text style={styles.legendText}>Barato</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: tanqColors.secondary }]} />
            <Text style={styles.legendText}>Médio</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F44336' }]} />
            <Text style={styles.legendText}>Caro</Text>
          </View>
        </View>
      </View>

      {/* Card do posto selecionado */}
      {selectedPosto && (
        <Card style={styles.selectedCard}>
          <Card.Content>
            <View style={styles.selectedHeader}>
              <Text style={styles.selectedTitle}>{selectedPosto.nome}</Text>
              <Button 
                mode="text" 
                compact 
                onPress={() => setSelectedPosto(null)}
              >
                ✕
              </Button>
            </View>
            <View style={styles.selectedPrecos}>
              {selectedPosto.precos.GASOLINA && (
                <Chip style={styles.chipGasolina}>
                  Gasolina: {formatarPreco(selectedPosto.precos.GASOLINA)}
                </Chip>
              )}
              {selectedPosto.precos.ETANOL && (
                <Chip style={styles.chipEtanol}>
                  Etanol: {formatarPreco(selectedPosto.precos.ETANOL)}
                </Chip>
              )}
              {selectedPosto.precos.DIESEL && (
                <Chip style={styles.chipDiesel}>
                  Diesel: {formatarPreco(selectedPosto.precos.DIESEL)}
                </Chip>
              )}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Contador */}
      <View style={styles.counter}>
        <Text style={styles.counterText}>
          {postos.length} {postos.length === 1 ? 'posto' : 'postos'} no mapa
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  map: {
    width: width,
    height: height,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  erroText: {
    color: tanqColors.error,
    fontSize: 16,
    textAlign: 'center',
  },
  callout: {
    padding: 8,
    minWidth: 150,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  calloutPreco: {
    fontSize: 12,
    color: '#666',
  },
  legendContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  legendTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 12,
  },
  legendItems: {
    gap: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  selectedCard: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    borderRadius: 12,
    elevation: 8,
  },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: tanqColors.primary,
  },
  selectedPrecos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipGasolina: {
    backgroundColor: '#E3F2FD',
  },
  chipEtanol: {
    backgroundColor: '#E8F5E9',
  },
  chipDiesel: {
    backgroundColor: '#FFF3E0',
  },
  counter: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 4,
  },
  counterText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: tanqColors.primary,
  },
});
