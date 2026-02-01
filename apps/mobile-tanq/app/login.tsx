import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card, HelperText } from 'react-native-paper';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../../libs/core-logic/src/context/AuthContext';
import { tanqColors } from '../theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const handleLogin = async () => {
    // Feedback tátil ao pressionar
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Validação básica
    if (!email.trim()) {
      setErro('Por favor, informe seu e-mail');
      return;
    }
    if (!senha) {
      setErro('Por favor, informe sua senha');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      await login(email.trim(), senha);
      // Navegar para home após login bem-sucedido
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Erro no login:', error);
      if (error.response?.data?.mensagem) {
        setErro(error.response.data.mensagem);
      } else if (error.response?.status === 401) {
        setErro('E-mail ou senha incorretos');
      } else if (error.message?.includes('Network')) {
        setErro('Erro de conexão. Verifique sua internet.');
      } else {
        setErro('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>⛽</Text>
          <Text style={styles.title}>Tanq</Text>
          <Text style={styles.subtitle}>Encontre os melhores preços</Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              left={<TextInput.Icon icon="email" />}
              style={styles.input}
              disabled={loading}
            />

            <TextInput
              label="Senha"
              value={senha}
              onChangeText={setSenha}
              mode="outlined"
              secureTextEntry={!senhaVisivel}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon 
                  icon={senhaVisivel ? 'eye-off' : 'eye'} 
                  onPress={() => setSenhaVisivel(!senhaVisivel)}
                />
              }
              style={styles.input}
              disabled={loading}
            />

            {erro ? (
              <HelperText type="error" visible={!!erro}>
                {erro}
              </HelperText>
            ) : null}

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              mode="outlined"
              onPress={() => router.push('/register')}
              style={styles.buttonSecondary}
              disabled={loading}
            >
              Criar uma conta
            </Button>
          </Card.Content>
        </Card>

        <Button
          mode="text"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          Voltar
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tanqColors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 64,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: tanqColors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  card: {
    elevation: 4,
    borderRadius: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonSecondary: {
    borderRadius: 8,
    borderColor: tanqColors.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
  },
  backButton: {
    marginTop: 16,
  },
});
