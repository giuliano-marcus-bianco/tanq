import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Chip, ActivityIndicator, Searchbar, FAB } from 'react-native-paper';
import { router, useFocusEffect } from 'expo-router';
import { postoService, precoService, useAuth } from '@tanq/core-logic';
import type { Posto, Preco } from '@tanq/core-logic';
import { tanqColors } from '../../theme';

interface PostoComPrecos extends Posto {
  precos: Record<string, number>;
}

export default function HomeScreen() {
  const { usuario, estaLogado } = useAuth();
  const [postos, setPostos] = useState<PostoComPrecos[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');

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
        precosPorPosto[preco.postoId][preco.tipoCombustivel] = preco.valor;
      });

      // Combinar postos com preços
      const postosComPrecos = postosRes.data.map((posto: Posto) => ({
        ...posto,
        precos: precosPorPosto[posto.id] || {},
      }));

      setPostos(postosComPrecos);
    } catch (error: any) {
      console.error('Erro ao carregar postos:', error);
      if (error.message?.includes('Network')) {
        setErro('Sem conexão. Verifique sua internet.');
      } else {
        setErro('Erro ao carregar postos.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    carregarDados();
  };

  const postosFiltrados = postos.filter(posto =>
    posto.nome.toLowerCase().includes(busca.toLowerCase()) ||
    posto.cidade?.toLowerCase().includes(busca.toLowerCase())
  );

  const formatarEndereco = (posto: Posto) => {
    const partes = [];
    if (posto.rua) {
      let end = posto.rua;
      if (posto.numero) end += ', ' + posto.numero;
      partes.push(end);
    }
    if (posto.bairro) partes.push(posto.bairro);
    if (posto.cidade) partes.push(posto.cidade);
    return partes.join(' - ') || 'Endereço não informado';
  };

  const formatarPreco = (valor: number | undefined) => {
    if (!valor) return '-';
    return `R$ ${valor.toFixed(2)}`;
  };

  const renderPosto = ({ item }: { item: PostoComPrecos }) => (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.postoNome}>{item.nome}</Text>
        </View>
        
        <Text style={styles.endereco}>{formatarEndereco(item)}</Text>

        <View style={styles.precosContainer}>
          {item.precos.GASOLINA && (
            <Chip icon="gas-station" style={styles.chipGasolina} textStyle={styles.chipText}>
              Gasolina: {formatarPreco(item.precos.GASOLINA)}
            </Chip>
          )}
          {item.precos.ETANOL && (
            <Chip icon="leaf" style={styles.chipEtanol} textStyle={styles.chipText}>
              Etanol: {formatarPreco(item.precos.ETANOL)}
            </Chip>
          )}
          {item.precos.DIESEL && (
            <Chip icon="truck" style={styles.chipDiesel} textStyle={styles.chipText}>
              Diesel: {formatarPreco(item.precos.DIESEL)}
            </Chip>
          )}
          {Object.keys(item.precos).length === 0 && (
            <Text style={styles.semPrecos}>Sem preços cadastrados</Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={tanqColors.primary} />
        <Text style={styles.loadingText}>Carregando postos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar postos..."
        onChangeText={setBusca}
        value={busca}
        style={styles.searchbar}
      />

      {erro ? (
        <View style={styles.centerContainer}>
          <Text style={styles.erroText}>{erro}</Text>
        </View>
      ) : (
        <FlatList
          data={postosFiltrados}
          renderItem={renderPosto}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[tanqColors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>
                {busca ? 'Nenhum posto encontrado' : 'Nenhum posto cadastrado ainda'}
              </Text>
            </View>
          }
          ListHeaderComponent={
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>
                {postosFiltrados.length} {postosFiltrados.length === 1 ? 'posto' : 'postos'} encontrados
              </Text>
            </View>
          }
        />
      )}

      {!estaLogado && (
        <FAB
          icon="login"
          style={styles.fab}
          onPress={() => router.push('/login')}
          label="Entrar"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tanqColors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  searchbar: {
    margin: 12,
    elevation: 2,
  },
  listContent: {
    padding: 12,
    paddingTop: 0,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  postoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: tanqColors.primary,
    flex: 1,
  },
  endereco: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  precosContainer: {
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
  chipText: {
    fontSize: 12,
  },
  semPrecos: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: tanqColors.secondary,
  },
});
