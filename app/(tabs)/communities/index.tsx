import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, SectionList, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CommunityService } from '../../../services/CommunityService';
import { Community } from '../../../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

const COLORS = {
    primary: '#6B4C9A', // Mountain Purple
    secondary: '#F5B800', // Dawn Yellow
    accent: '#FF6B6B', // Adventure Coral
    neutralLight: '#FAFAFA', // Mist White
    neutralDark: '#3D3D5C', // Rock Gray
    minorAccent: '#5A8C6F', // Green
    white: '#FFFFFF',
    gray: '#666666',
    border: '#E0E0E0',
};

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
                newSections.push({ title: 'Managed by me', data: data.owned_communities });
            }
            
            if (data.my_communities && data.my_communities.length > 0) {
                newSections.push({ title: 'My Communities', data: data.my_communities });
            }

            if (data.other_communities && data.other_communities.length > 0) {
                newSections.push({ title: 'Discover Communities', data: data.other_communities });
            }

            setSections(newSections);
        } catch (error: any) {
            console.error('Failed to fetch communities:', error);
            // Check if it's a network error or backend error
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
                <FontAwesome name="chevron-right" size={14} color={COLORS.gray} />
            </View>
            <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
            
            {/* Optional: Add some visual indicators or stats here */}
            <View style={styles.cardFooter}>
                {item.address ? (
                     <View style={styles.locationContainer}>
                        <FontAwesome name="map-marker" size={12} color={COLORS.minorAccent} style={{marginRight: 4}} />
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
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.neutralLight} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Communities</Text>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => router.push('/(tabs)/communities/create')}
                >
                    <FontAwesome name="plus" size={16} color="#fff" />
                    <Text style={styles.createButtonText}>Create</Text>
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
                        <Text style={styles.emptyText}>No communities found.</Text>
                        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
                            <Text style={styles.refreshButtonText}>Refresh</Text>
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
        backgroundColor: COLORS.neutralLight,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.neutralLight,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
        fontFamily: 'System',
    },
    createButton: {
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    createButtonText: {
        color: COLORS.neutralDark,
        fontWeight: 'bold',
        marginLeft: 6,
        fontSize: 14,
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
    },
    sectionHeader: {
        marginBottom: 12,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.neutralDark,
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: COLORS.neutralDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.neutralDark,
        flex: 1,
        marginRight: 8,
    },
    cardDescription: {
        fontSize: 14,
        color: COLORS.gray,
        lineHeight: 20,
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    locationText: {
        fontSize: 12,
        color: COLORS.gray,
        maxWidth: 150,
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
        padding: 10,
    },
    refreshButtonText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
});
