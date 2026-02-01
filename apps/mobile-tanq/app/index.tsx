import { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { router } from 'expo-router';
import { useAuth } from '@tanq/core-logic';
import { tanqColors } from '../theme';

export default function WelcomeScreen() {
  const { estaLogado, loading } = useAuth();

  useEffect(() => {
    // Se já está logado, redireciona para a home
    if (!loading && estaLogado) {
      router.replace('/(tabs)');
    }
  }, [loading, estaLogado]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.logo}>⛽</Text>
        <ActivityIndicator size="large" color={tanqColors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>⛽</Text>
        <Text style={styles.title}>Tanq</Text>
        <Text style={styles.subtitle}>
          Encontre os melhores preços de combustível na sua região
        </Text>
      </View>

      <View style={styles.features}>
        <FeatureItem 
          emoji="🔍" 
          title="Busque postos" 
          description="Encontre postos próximos a você"
        />
        <FeatureItem 
          emoji="💰" 
          title="Compare preços" 
          description="Veja rankings de preços por tipo de combustível"
        />
        <FeatureItem 
          emoji="🗺️" 
          title="Navegue no mapa" 
          description="Visualize todos os postos no mapa"
        />
        <FeatureItem 
          emoji="⭐" 
          title="Avalie postos" 
          description="Compartilhe sua experiência com outros motoristas"
        />
      </View>

      <View style={styles.actions}>
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
          contentStyle={styles.buttonContent}
        >
          Criar conta
        </Button>

        <Button
          mode="text"
          onPress={() => router.push('/(tabs)')}
          style={styles.skipButton}
        >
          Explorar sem conta →
        </Button>
      </View>
    </View>
  );
}

function FeatureItem({ emoji, title, description }: { 
  emoji: string; 
  title: string; 
  description: string;
}) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureEmoji}>{emoji}</Text>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    fontSize: 72,
    marginBottom: 8,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: tanqColors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  features: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tanqColors.background,
    padding: 16,
    borderRadius: 12,
  },
  featureEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  actions: {
    gap: 12,
    marginBottom: 20,
  },
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonSecondary: {
    borderRadius: 8,
    borderColor: tanqColors.primary,
  },
  skipButton: {
    marginTop: 8,
  },
});
