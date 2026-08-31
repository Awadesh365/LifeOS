import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/auth/provider';
import { radii, spacing, type ThemeColors } from '@/theme';
import { useLifeOSTheme } from '@/theme/provider';

export default function SignInScreen() {
  const { registrationOpen, login, register } = useAuth();
  const { colors } = useLifeOSTheme();
  const styles = createStyles(colors);
  const [displayName, setDisplayName] = useState('Awadesh');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>(registrationOpen ? 'signup' : 'signin');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (mode === 'signup' && !registrationOpen) {
      setError('Account creation is closed for this private workspace');
      return;
    }
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      if (mode === 'signup') await register(displayName, email, password);
      else await login(email, password);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not authenticate');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.brand}><View style={styles.mark}><Text style={styles.markText}>L</Text></View><Text style={styles.brandText}>LifeOS</Text></View>
          <Text style={styles.eyebrow}>Private personal workspace</Text>
          <View accessibilityRole="tablist" style={styles.modeSwitch}>
            <Pressable accessibilityRole="tab" accessibilityState={{ selected: mode === 'signin' }} onPress={() => { setMode('signin'); setError(''); }} style={[styles.modeButton, mode === 'signin' && styles.modeButtonActive]}><Text style={[styles.modeText, mode === 'signin' && styles.modeTextActive]}>Sign in</Text></Pressable>
            <Pressable accessibilityRole="tab" accessibilityState={{ selected: mode === 'signup' }} onPress={() => { setMode('signup'); setError(''); }} style={[styles.modeButton, mode === 'signup' && styles.modeButtonActive]}><Text style={[styles.modeText, mode === 'signup' && styles.modeTextActive]}>Create account</Text></Pressable>
          </View>
          <Text accessibilityRole="header" style={styles.title}>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</Text>
          <Text style={styles.intro}>{mode === 'signup' && registrationOpen ? 'Create the owner account. Setup closes automatically afterward.' : mode === 'signup' ? 'Account creation is closed because this private workspace already has an owner.' : 'Sign in to continue to your personal operating system.'}</Text>
          <View style={styles.form}>
            {mode === 'signup' ? (
              <Field autoComplete="name" label="Name" value={displayName} onChangeText={setDisplayName} styles={styles} />
            ) : null}
            <Field autoCapitalize="none" autoComplete="email" keyboardType="email-address" label="Email" value={email} onChangeText={setEmail} styles={styles} />
            <Field autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} label="Password" secureTextEntry value={password} onChangeText={setPassword} styles={styles} />
            {mode === 'signup' ? (
              <Field autoComplete="new-password" label="Confirm password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} styles={styles} />
            ) : null}
            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
            <Pressable disabled={submitting || (mode === 'signup' && !registrationOpen)} onPress={() => void submit()} style={({ pressed }) => [styles.button, pressed && styles.pressed, (submitting || (mode === 'signup' && !registrationOpen)) && styles.disabled]}>
              {submitting ? <ActivityIndicator color={colors.primaryContrast} /> : <Text style={styles.buttonText}>{mode === 'signup' ? 'Create account' : 'Sign in'}</Text>}
            </Pressable>
          </View>
          <Text style={styles.note}>
            {Platform.OS === 'web'
              ? 'Your session stays in an HttpOnly cookie and is not exposed to browser JavaScript.'
              : 'Your opaque server session is encrypted in this device’s Keychain or Keystore. Your password is never saved.'}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, styles, ...props }: React.ComponentProps<typeof TextInput> & { label: string; styles: ReturnType<typeof createStyles> }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput placeholderTextColor="#738196" style={styles.input} {...props} /></View>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  page: { backgroundColor: colors.background, flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, borderWidth: 1, padding: spacing.xl },
  brand: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  mark: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: radii.sm, height: 40, justifyContent: 'center', width: 40 },
  markText: { color: colors.primaryContrast, fontSize: 16, fontWeight: '900' },
  brandText: { color: colors.ink, fontSize: 18, fontWeight: '900' },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1.1, marginTop: spacing.xxl, textTransform: 'uppercase' },
  modeSwitch: { backgroundColor: colors.surfaceMuted, borderColor: colors.border, borderRadius: radii.sm, borderWidth: 1, flexDirection: 'row', gap: 4, marginBottom: spacing.xl, marginTop: spacing.xl, padding: 4 },
  modeButton: { alignItems: 'center', borderRadius: radii.sm, flex: 1, justifyContent: 'center', minHeight: 42 },
  modeButtonActive: { backgroundColor: colors.primary },
  modeText: { color: colors.inkMuted, fontSize: 13, fontWeight: '900' },
  modeTextActive: { color: colors.primaryContrast },
  title: { color: colors.ink, fontSize: 31, fontWeight: '900', letterSpacing: -1, marginTop: spacing.sm },
  intro: { color: colors.inkMuted, fontSize: 14, lineHeight: 21, marginTop: spacing.sm },
  form: { gap: spacing.lg, marginTop: spacing.xl },
  field: { gap: spacing.sm },
  label: { color: colors.ink, fontSize: 13, fontWeight: '800' },
  input: { backgroundColor: colors.surfaceMuted, borderColor: colors.border, borderRadius: radii.sm, borderWidth: 1, color: colors.ink, fontSize: 15, minHeight: 48, paddingHorizontal: spacing.lg },
  error: { backgroundColor: colors.dangerSoft, borderRadius: radii.sm, color: colors.danger, fontSize: 13, padding: spacing.md },
  button: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: radii.sm, justifyContent: 'center', minHeight: 50 },
  buttonText: { color: colors.primaryContrast, fontSize: 14, fontWeight: '900' },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.6 },
  note: { color: colors.inkMuted, fontSize: 11, lineHeight: 17, marginTop: spacing.xl, textAlign: 'center' },
});
