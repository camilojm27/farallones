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
          <Ionicons name="mail-outline" size={50} color="#6B4C9A" />
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email and we'll send a reset link.
          </Text>
        </View>

        {successMessage ? (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#065F46" style={styles.successIcon} />
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormTextField
              label="Email address"
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
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backLink}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={16} color="#6B4C9A" />
          <Text style={styles.backText}>Back to sign in</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#F8FAFC",
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1E293B",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#D1FAE5",
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
    gap: 10,
  },
  successIcon: {
    marginTop: 1,
  },
  successText: {
    color: "#065F46",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#6B4C9A",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#9B8BBF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    gap: 6,
  },
  backText: {
    color: "#6B4C9A",
    fontSize: 14,
    fontWeight: "600",
  },
});
