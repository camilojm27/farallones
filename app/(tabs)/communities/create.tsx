import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { CommunityService } from '../../../services/CommunityService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../../constants/Colors';

export default function CreateCommunityScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        phone_number: '',
        email: '',
        website: '',
    });

    const handleCreate = async () => {
        if (!formData.name) {
            Alert.alert('Error', 'El nombre de la comunidad es requerido');
            return;
        }

        // Clean form data: convert empty strings to null/undefined
        const dataToSubmit = Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [key, value.trim() === '' ? null : value])
        );

        setLoading(true);
        try {
            await CommunityService.createCommunity(dataToSubmit);
            Alert.alert('Éxito', 'Comunidad creada exitosamente', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            console.error('Failed to create community:', error);
            const message = error.response?.data?.message || 'Hubo un error al crear la comunidad. Por favor, intenta de nuevo.';
            const validationErrors = error.response?.data?.errors;
            
            if (validationErrors) {
                const errorMessages = Object.values(validationErrors).flat().join('\n');
                Alert.alert('Error de Validación', errorMessages);
            } else {
                Alert.alert('Error', message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={20} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Crear Comunidad</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nombre *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                        placeholder="Nombre de la comunidad"
                        placeholderTextColor={COLORS.gray}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Descripción</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData.description}
                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                        placeholder="¿De qué trata esta comunidad?"
                        placeholderTextColor={COLORS.gray}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Dirección</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.address}
                        onChangeText={(text) => setFormData({ ...formData, address: text })}
                        placeholder="Ubicación física (opcional)"
                        placeholderTextColor={COLORS.gray}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Teléfono</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.phone_number}
                        onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
                        placeholder="Teléfono de contacto (opcional)"
                        placeholderTextColor={COLORS.gray}
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Correo electrónico</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                        placeholder="Correo de contacto (opcional)"
                        placeholderTextColor={COLORS.gray}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Sitio Web</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.website}
                        onChangeText={(text) => setFormData({ ...formData, website: text })}
                        placeholder="URL del sitio web (opcional)"
                        placeholderTextColor={COLORS.gray}
                        autoCapitalize="none"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.disabledButton]}
                    onPress={handleCreate}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.text} />
                    ) : (
                        <Text style={styles.submitButtonText}>Crear Comunidad</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingTop: 20,
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    backButton: {
        padding: 10,
        backgroundColor: 'rgba(107, 76, 154, 0.1)',
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    content: {
        padding: 24,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: COLORS.text,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        backgroundColor: COLORS.white,
        color: COLORS.text,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: COLORS.secondary,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 60,
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    disabledButton: {
        backgroundColor: COLORS.lightGray,
        shadowOpacity: 0,
        elevation: 0,
    },
    submitButtonText: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
});