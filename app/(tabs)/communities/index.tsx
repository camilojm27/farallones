import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, SectionList, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CommunityService } from '../../../services/CommunityService';
import { Community } from '../../../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../../../constants/Colors';

export default function CommunitiesScreen() {
    const router = useRouter();
    const [sections, setSections] = useState<{ title: string; data: Community[] }[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchCommunities = async () => {
        try {
            const data = await CommunityService.getCommunities();
            
            const newSections = [];
            
            if (data.owned_communities && data.owned_communities.length > 0) {
                newSections.push({ title: 'Administradas por mí', data: data.owned_communities });
            }
            
            if (data.my_communities && data.my_communities.length > 0) {
                newSections.push({ title: 'Mis Comunidades', data: data.my_communities });
            }

            if (data.other_communities && data.other_communities.length > 0) {
                newSections.push({ title: 'Descubrir Comunidades', data: data.other_communities });
            }

            setSections(newSections);
        } catch (error: any) {
            console.error('Failed to fetch communities:', error);
            const message = error.response?.data?.message || error.message || 'Failed to fetch communities';
            Alert.alert('Error', message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCommunities();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCommunities();
    };

    const renderCommunityItem = ({ item }: { item: Community }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/communities/${item.id}`)}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View style={styles.iconCircle}>
                    <FontAwesome name="chevron-right" size={12} color={COLORS.primary} />
                </View>
            </View>
            <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
            
            <View style={styles.cardFooter}>
                {item.address ? (
                     <View style={styles.locationContainer}>
                        <FontAwesome name="map-marker" size={12} color={COLORS.success} style={{marginRight: 6}} />
                        <Text style={styles.locationText} numberOfLines={1}>{item.address}</Text>
                     </View>
                ) : <View />}
            </View>
        </TouchableOpacity>
    );

    const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Comunidades</Text>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => router.push('/(tabs)/communities/create')}
                >
                    <FontAwesome name="plus" size={16} color={COLORS.primary} />
                    <Text style={styles.createButtonText}>Crear</Text>
                </TouchableOpacity>
            </View>

            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderCommunityItem}
                renderSectionHeader={renderSectionHeader}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                }
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No se encontraron comunidades.</Text>
                        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
                            <Text style={styles.refreshButtonText}>Actualizar</Text>
                        </TouchableOpacity>
                    </View>
                )}
                contentContainerStyle={styles.listContent}
                stickySectionHeadersEnabled={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        backgroundColor: COLORS.background,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
        letterSpacing: -0.5,
    },
    createButton: {
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    createButtonText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        marginLeft: 6,
        fontSize: 14,
    },
    listContent: {
        padding: 20,
        paddingBottom: 100, // Make room for floating tab bar
    },
    sectionHeader: {
        marginBottom: 16,
        marginTop: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.text,
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: COLORS.text,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
        flex: 1,
        marginRight: 12,
    },
    iconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(107, 76, 154, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardDescription: {
        fontSize: 15,
        color: COLORS.gray,
        lineHeight: 22,
        marginBottom: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(90, 140, 111, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    locationText: {
        fontSize: 13,
        color: COLORS.success,
        fontWeight: '500',
    },
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.gray,
        textAlign: 'center',
        marginBottom: 16,
    },
    refreshButton: {
        padding: 12,
        backgroundColor: 'rgba(107, 76, 154, 0.1)',
        borderRadius: 12,
    },
    refreshButtonText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
});