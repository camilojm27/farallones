import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  StatusBar
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CommunityService } from '../../../services/CommunityService';
import { Community } from '../../../types';
import { COLORS } from '../../../constants/Colors';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CommunityDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDetails = useCallback(async () => {
    try {
      const data = await CommunityService.getCommunityDetails(Number(id));
      setCommunity(data);
    } catch {
      Alert.alert('Error', 'No se pudo cargar la información de la comunidad');
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleJoin = async () => {
    setActionLoading(true);
    try {
      await CommunityService.joinCommunity(Number(id));
      Alert.alert('¡Bienvenido!', 'Te has unido a la comunidad');
      fetchDetails();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'No se pudo unir a la comunidad');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    Alert.alert('Abandonar', '¿Estás seguro que quieres abandonar esta comunidad?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Abandonar',
        style: 'destructive',
        onPress: async () => {
          setActionLoading(true);
          try {
            await CommunityService.leaveCommunity(Number(id));
            Alert.alert('Comunidad abandonada', 'Has dejado la comunidad exitosamente');
            fetchDetails();
          } catch {
            Alert.alert('Error', 'No se pudo abandonar la comunidad');
          } finally {
            setActionLoading(false);
          }
        }
      }
    ]);
  };

  if (loading || !community) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Use a fallback gradient-like placeholder if no banner
  const hasBanner = !!community.banner;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroContainer}>
          {hasBanner ? (
            <Image source={{ uri: community.banner }} style={styles.heroImage} />
          ) : (
            <View style={styles.heroPlaceholder} />
          )}
          
          <SafeAreaView style={styles.safeTopContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </SafeAreaView>

          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>{community.name}</Text>
            {community.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.white} />
                <Text style={styles.verifiedText}>Verificada</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.actionContainer}>
            {community.is_owner ? (
              <View style={styles.ownerBadge}>
                <FontAwesome name="star" size={16} color={COLORS.secondary} />
                <Text style={styles.ownerBadgeText}>Eres el creador</Text>
              </View>
            ) : community.is_member ? (
              <TouchableOpacity 
                style={[styles.actionButton, styles.leaveButton]} 
                onPress={handleLeave}
                disabled={actionLoading}
              >
                {actionLoading ? <ActivityIndicator color={COLORS.primary} /> : (
                  <>
                    <Ionicons name="log-out-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.leaveButtonText}>Abandonar</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.actionButton, styles.joinButton]} 
                onPress={handleJoin}
                disabled={actionLoading}
              >
                {actionLoading ? <ActivityIndicator color={COLORS.white} /> : (
                  <>
                    <Ionicons name="person-add-outline" size={20} color={COLORS.white} />
                    <Text style={styles.joinButtonText}>Unirse a la aventura</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre nosotros</Text>
            <Text style={styles.descriptionText}>{community.description || 'Sin descripción disponible.'}</Text>
          </View>

          <View style={styles.detailsCard}>
            {community.address && (
              <View style={styles.detailRow}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(90, 140, 111, 0.1)' }]}>
                  <Ionicons name="location-outline" size={20} color={COLORS.success} />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Ubicación</Text>
                  <Text style={styles.detailValue}>{community.address}</Text>
                </View>
              </View>
            )}

            {community.phone_number && (
              <View style={styles.detailRow}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(107, 76, 154, 0.1)' }]}>
                  <Ionicons name="call-outline" size={20} color={COLORS.primary} />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Teléfono</Text>
                  <Text style={styles.detailValue}>{community.phone_number}</Text>
                </View>
              </View>
            )}

            {community.email && (
              <View style={styles.detailRow}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(245, 184, 0, 0.1)' }]}>
                  <Ionicons name="mail-outline" size={20} color={COLORS.secondary} />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Correo</Text>
                  <Text style={styles.detailValue}>{community.email}</Text>
                </View>
              </View>
            )}

            {community.website && (
              <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(61, 61, 92, 0.1)' }]}>
                  <Ionicons name="globe-outline" size={20} color={COLORS.text} />
                </View>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Sitio web</Text>
                  <Text style={styles.detailValue}>{community.website}</Text>
                </View>
              </View>
            )}
          </View>

        </View>
      </ScrollView>
    </View>
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
  scrollContent: {
    paddingBottom: 100, // For the floating tab bar
  },
  heroContainer: {
    height: 320,
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.primary,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  heroPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  safeTopContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingTop: 60, // gradient effect approximation
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  verifiedText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    padding: 24,
  },
  actionContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  actionButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 10,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  joinButton: {
    backgroundColor: COLORS.accent,
    shadowColor: COLORS.accent,
  },
  joinButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  leaveButton: {
    backgroundColor: 'rgba(107, 76, 154, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(107, 76, 154, 0.3)',
    shadowColor: 'transparent',
    elevation: 0,
  },
  leaveButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  ownerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 184, 0, 0.15)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 184, 0, 0.4)',
  },
  ownerBadgeText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 16,
    color: COLORS.gray,
    lineHeight: 26,
  },
  detailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.gray,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
});
