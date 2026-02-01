import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card, HelperText, SegmentedButtons } from 'react-native-paper';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../../libs/core-logic/src/context/AuthContext';
import { tanqColors } from '../theme';

type TipoUsuario = 'MOTORISTA' | 'DONO_POSTO';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tipo, setTipo] = useState<TipoUsuario>('MOTORISTA');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const handleRegister = async () => {
    // Feedback tátil ao pressionar
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Validações
    if (!nome.trim()) {
      setErro('Por favor, informe seu nome');
      return;
    }
    if (!email.trim()) {
      setErro('Por favor, informe seu e-mail');
      return;
    }
    if (!email.includes('@')) {
      setErro('E-mail inválido');
      return;
    }
    if (!senha) {
      setErro('Por favor, informe uma senha');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    if (senha !== confirmarSenha) {
      setErro('As senhas não conferem');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      await register({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        tipo,
      });
      // Navegar para home após registro bem-sucedido
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Erro no registro:', error);
      if (error.response?.data?.mensagem) {
        setErro(error.response.data.mensagem);
      } else if (error.response?.status === 409) {
        setErro('Este e-mail já está em uso');
      } else if (error.message?.includes('Network')) {
        setErro('Erro de conexão. Verifique sua internet.');
      } else {
        setErro('Erro ao criar conta. Tente novamente.');
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
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Junte-se ao Tanq</Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Nome completo"
              value={nome}
              onChangeText={setNome}
              mode="outlined"
              autoCapitalize="words"
              left={<TextInput.Icon icon="account" />}
              style={styles.input}
              disabled={loading}
            />

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

            <TextInput
              label="Confirmar senha"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              mode="outlined"
              secureTextEntry={!senhaVisivel}
              left={<TextInput.Icon icon="lock-check" />}
              style={styles.input}
              disabled={loading}
            />

            <Text style={styles.tipoLabel}>Tipo de conta:</Text>
            <SegmentedButtons
              value={tipo}
              onValueChange={(value) => setTipo(value as TipoUsuario)}
              buttons={[
                {
                  value: 'MOTORISTA',
                  label: '🚗 Motorista',
                },
                {
                  value: 'DONO_POSTO',
                  label: '⛽ Dono de Posto',
                },
              ]}
              style={styles.segmented}
            />

            {erro ? (
              <HelperText type="error" visible={!!erro}>
                {erro}
              </HelperText>
            ) : null}

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já tem uma conta? </Text>
              <Button
                mode="text"
                onPress={() => router.push('/login')}
                compact
                disabled={loading}
              >
                Entrar
              </Button>
            </View>
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
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
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
  tipoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginTop: 4,
  },
  segmented: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
  },
  backButton: {
    marginTop: 16,
  },
});
