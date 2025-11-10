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
  import { Ionicons } from "@expo/vector-icons";
  
  export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<{
      email?: string[];
    }>({});
    const [status, setStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
  
    async function handleForgotPassword() {
      setErrors({});
      setStatus(null);
      setIsLoading(true);
      try {
        const resetStatus = await sendPasswordResetLink(email);
        setStatus(resetStatus);
      } catch (e: any) {
        if (e.response?.status === 422) {
          console.log("errors", e.response.data.errors);
          setErrors(e.response.data.errors);
        }
        if (e.response?.status === 500) {
          console.error("errors", e.response.data);
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
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>We'll send you a reset link</Text>
          </View>

          {status && (
            <View style={styles.successContainer}>
              <Text style={styles.resetStatus}>{status}</Text>
            </View>
          )}

          <FormTextField
            label="Email address"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            errors={errors.email}
          />
          
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleForgotPassword}
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
            onPress={() => router.push("/login")}
          >
            <Ionicons name="arrow-back" size={16} color="#6B4C9A" />
            <Text style={styles.backText}>
              Back to login
            </Text>
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
    },
    successContainer: {
      backgroundColor: "#d1fae5",
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      alignItems: "center",
    },
    resetStatus: {
      color: "#5A8C6F",
      fontSize: 14,
      fontWeight: "600",
      textAlign: "center",
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
    backLink: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 24,
    },
    backText: {
      color: "#6B4C9A",
      fontSize: 14,
      fontWeight: "600",
      marginLeft: 6,
    },
  }); 