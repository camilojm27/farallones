import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useState, useContext } from "react";
import { router } from "expo-router";
import FormTextField from "../components/FormTextField";
import { register, loadUser } from "../services/AuthService";
import { AuthContext } from "../context/AuthContext";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";

const RegisterSchema = z
  .object({
    first_name: z.string().min(1, "First name is required."),
    last_name: z.string().min(1, "Last name is required."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  });

type RegisterFormData = z.infer<typeof RegisterSchema>;

export default function Register() {
  const { setUser } = useContext(AuthContext);
  const [generalError, setGeneralError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  async function handleRegister(data: RegisterFormData) {
    setGeneralError("");
    setIsLoading(true);
    try {
      await register({
        ...data,
        device_name: `${Platform.OS} ${Platform.Version}`,
      });
      const user = await loadUser();
      setUser(user);
      router.replace("/(tabs)");
    } catch (error: any) {
      if (error.response?.status === 422) {
        const errors = error.response.data?.errors;
        if (errors) {
          setGeneralError(Object.values(errors).flat().join("\n"));
        } else {
          setGeneralError(error.response.data?.message ?? "Please check your input.");
        }
      } else if (!error.response) {
        setGeneralError("Cannot reach the server. Please check your connection.");
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Ionicons name="person-add-outline" size={50} color="#6B4C9A" />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start your journey with us</Text>
          </View>

          {generalError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.generalError}>{generalError}</Text>
            </View>
          ) : null}

          <Controller
            control={control}
            name="first_name"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextField
                label="First Name"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                errors={errors.first_name ? [errors.first_name.message!] : []}
              />
            )}
          />
          <Controller
            control={control}
            name="last_name"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextField
                label="Last Name"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                errors={errors.last_name ? [errors.last_name.message!] : []}
              />
            )}
          />
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
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextField
                label="Password"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                isPassword={true}
                errors={errors.password ? [errors.password.message!] : []}
              />
            )}
          />
          <Controller
            control={control}
            name="password_confirmation"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextField
                label="Confirm Password"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                isPassword={true}
                errors={
                  errors.password_confirmation
                    ? [errors.password_confirmation.message!]
                    : []
                }
              />
            )}
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit(handleRegister)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.loginLink}>Sign in here</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#F8FAFC",
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
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
  },
  errorContainer: {
    backgroundColor: "#FECACA",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  generalError: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#6B4C9A",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: "#9B8BBF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    color: "#475569",
    fontSize: 14,
  },
  loginLink: {
    color: "#6B4C9A",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },
});
