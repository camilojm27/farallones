import React, { useContext, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { COLORS } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const Settings = () => {
  const { user } = useContext(AuthContext);

  const profileFields = useMemo(
    () => [
      { label: "Nombre", value: user?.first_name },
      { label: "Apellido", value: user?.last_name },
      { label: "Usuario", value: user?.username },
      { label: "Correo", value: user?.email },
      { label: "Teléfono", value: user?.phone_number },
      { label: "Miembro desde", value: formatDate(user?.created_at) },
      { label: "Última actualización", value: formatDate(user?.updated_at) },
    ],
    [user]
  );

  if (!user) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="person-outline" size={64} color={COLORS.gray} />
        <Text style={styles.emptyStateTitle}>No hay datos de perfil disponibles</Text>
        <Text style={styles.emptyStateSubtitle}>
          Vuelve a iniciar sesión para cargar la información de tu perfil.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.heading}>Ajustes de Perfil</Text>
        <Text style={styles.subtitle}>Información detallada de tu cuenta</Text>
      </View>
      
      <View style={styles.card}>
        {profileFields.map(({ label, value }, index) => (
          <View 
            key={label} 
            style={[
              styles.fieldRow,
              index === profileFields.length - 1 && styles.lastFieldRow
            ]}
          >
            <Text style={styles.fieldLabel}>{label}</Text>
            <Text style={styles.fieldValue}>{value ?? "—"}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 100, // Safe area for floating bottom bar
  },
  header: {
    marginBottom: 24,
    marginTop: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  fieldRow: {
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.lightGray,
  },
  lastFieldRow: {
    borderBottomWidth: 0,
    paddingBottom: 4,
  },
  fieldLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  fieldValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    backgroundColor: COLORS.background,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 24,
  },
});

export default Settings;