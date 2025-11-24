import React, { useContext, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../../context/AuthContext";

const Settings = () => {
  const { user } = useContext(AuthContext);

  const profileFields = useMemo(
    () => [
      { label: "Name", value: user?.name },
      { label: "Username", value: user?.username },
      { label: "Email", value: user?.email },
      { label: "Email Verified", value: formatDate(user?.email_verified_at) },
      { label: "Phone Number", value: user?.phone_number },
      { label: "Member Since", value: formatDate(user?.created_at) },
      { label: "Last Updated", value: formatDate(user?.updated_at) },
    ],
    [user]
  );

  if (!user) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateTitle}>No profile data available</Text>
        <Text style={styles.emptyStateSubtitle}>
          Sign in again to refresh your profile information.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.heading}>Profile</Text>
      <View style={styles.card}>
        {profileFields.map(({ label, value }) => (
          <View key={label} style={styles.fieldRow}>
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

  return parsedDate.toLocaleString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  contentContainer: {
    padding: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    color: "#0f172a",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  fieldRow: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e2e8f0",
  },
  fieldLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#ffffff",
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
});

export default Settings;
