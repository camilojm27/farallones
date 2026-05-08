import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import FormTextField from "../components/FormTextField";
import { sendPasswordResetLink } from "../services/AuthService";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPassword() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  async function handleForgotPassword(data: ForgotPasswordFormData) {
    setSuccessMessage(null);
    setIsLoading(true);
    try {
      const status = await sendPasswordResetLink(data.email);
      setSuccessMessage(status);
    } catch (error: any) {
      if (error.response?.status === 422) {
        const apiErrors = error.response.data?.errors?.email;
        if (apiErrors) {
          setError("email", { message: apiErrors[0] });
        } else {
          setError("email", { message: "Please enter a valid email address." });
        }
      } else if (!error.response) {
        setError("email", { message: "Cannot reach the server. Please check your connection." });
      } else {
        setError("email", { message: "An unexpected error occurred. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail-outline" size={40} color={COLORS.white} />
          </View>
          <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
          <Text style={styles.subtitle}>
            Ingresa tu correo y te enviaremos un enlace de recuperación.
          </Text>
        </View>

        {successMessage ? (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.success} style={styles.successIcon} />
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormTextField
              label="Correo electrónico"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              keyboardType="email-address"
              errors={errors.email ? [errors.email.message!] : []}
            />
          )}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit(handleForgotPassword)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.text} />
          ) : (
            <Text style={styles.buttonText}>Enviar enlace</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backLink}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={16} color={COLORS.primary} />
          <Text style={styles.backText}>Volver a iniciar sesión</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.primary,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 24,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: 'rgba(90, 140, 111, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(90, 140, 111, 0.3)',
  },
  successIcon: {
    marginTop: 2,
  },
  successText: {
    color: COLORS.success,
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    lineHeight: 22,
  },
  button: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 16,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: COLORS.lightGray,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  backLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    gap: 8,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "bold",
  },
});