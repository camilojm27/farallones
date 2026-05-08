import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";

interface Props extends TextInputProps {
  label: string;
  errors?: string[];
  isPassword?: boolean;
}

export default function FormTextField({
  label,
  errors = [],
  isPassword = false,
  ...rest
}: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, isFocused && styles.inputFocused, errors.length > 0 && styles.inputError]}>
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={COLORS.gray}
          {...rest}
        ></TextInput>
        {isPassword && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.icon}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color={COLORS.gray}
            />
          </TouchableOpacity>
        )}
      </View>
      {errors.map((error) => {
        return (
          <Text key={error} style={styles.error}>
            {error}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: COLORS.text,
    fontWeight: "600",
    marginBottom: 6,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderColor: COLORS.lightGray,
    borderWidth: 1,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  inputError: {
    borderColor: COLORS.accent,
  },
  textInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 14,
    color: COLORS.text,
    fontSize: 16,
  },
  icon: {
    padding: 10,
    paddingRight: 14,
  },
  error: {
    color: COLORS.accent,
    marginTop: 6,
    fontSize: 12,
    fontWeight: "500",
  },
});
