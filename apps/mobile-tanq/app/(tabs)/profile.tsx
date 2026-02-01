import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, Avatar, List, Divider } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '@tanq/core-logic';
import { tanqColors } from '../../theme';

export default function ProfileScreen() {
  const { usuario, logout, estaLogado } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  if (!estaLogado) {
    return (
      <View style={styles.container}>
        <View style={styles.notLoggedContainer}>
          <Text style={styles.emoji}>👤</Text>
          <Text style={styles.title}>Faça login para acessar</Text>
          <Text style={styles.subtitle}>
            Entre na sua conta para ver seu perfil e gerenciar seus postos
          </Text>

          <Button
            mode="contained"
            onPress={() => router.push('/login')}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Entrar
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.push('/register')}
            style={styles.buttonSecondary}
          >
            Criar uma conta
          </Button>
        </View>
      </View>
    );
  }

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'MOTORISTA':
        return '🚗 Motorista';
      case 'DONO_POSTO':
        return '⛽ Dono de Posto';
      case 'ADMINISTRADOR':
        return '👑 Administrador';
      default:
        return tipo;
    }
  };

  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text 
            size={80} 
            label={getInitials(usuario?.nome || 'U')} 
            style={styles.avatar}
          />
          <Text style={styles.nome}>{usuario?.nome}</Text>
          <Text style={styles.email}>{usuario?.email}</Text>
          <View style={styles.tipoBadge}>
            <Text style={styles.tipoText}>{getTipoLabel(usuario?.tipo || '')}</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.menuCard}>
        <List.Section>
          <List.Item
            title="Meus Posts"
            description="Gerencie suas publicações de preços"
            left={props => <List.Icon {...props} icon="gas-station" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {/* TODO: Navegar para meus posts */}}
          />
          <Divider />
          <List.Item
            title="Minhas Avaliações"
            description="Veja suas avaliações de postos"
            left={props => <List.Icon {...props} icon="star" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {/* TODO: Navegar para minhas avaliações */}}
          />
          <Divider />
          <List.Item
            title="Configurações"
            description="Preferências do aplicativo"
            left={props => <List.Icon {...props} icon="cog" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {/* TODO: Navegar para configurações */}}
          />
        </List.Section>
      </Card>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        textColor={tanqColors.error}
        icon="logout"
      >
        Sair da conta
      </Button>

      <Text style={styles.version}>Tanq v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tanqColors.background,
    padding: 16,
  },
  notLoggedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: tanqColors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  button: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonSecondary: {
    width: '100%',
    borderRadius: 8,
    borderColor: tanqColors.primary,
  },
  profileCard: {
    marginBottom: 16,
    borderRadius: 16,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    backgroundColor: tanqColors.primary,
    marginBottom: 16,
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  tipoBadge: {
    backgroundColor: tanqColors.primaryLight + '20',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tipoText: {
    color: tanqColors.primary,
    fontWeight: '600',
  },
  menuCard: {
    borderRadius: 16,
    marginBottom: 24,
  },
  logoutButton: {
    borderColor: tanqColors.error,
    borderRadius: 8,
  },
  version: {
    textAlign: 'center',
    color: '#999',
    marginTop: 'auto',
    paddingBottom: 20,
  },
});
