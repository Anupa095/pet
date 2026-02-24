import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING } from '../utils/theme';
import { db } from '../services/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { uploadImage } from '../services/imageService';

const PetDetailScreen = ({ route, navigation }) => {
    const { pet } = route.params;
    const [currentImage, setCurrentImage] = useState(pet.image);
    const [uploading, setUploading] = useState(false);

    const handleUpdateImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setUploading(true);
            try {
                const fileName = `pets/${Date.now()}_${pet.name}.jpg`;
                const imageUrl = await uploadImage(result.assets[0].uri, fileName);

                // Update Firestore
                const petRef = doc(db, 'pets', pet.id);
                await updateDoc(petRef, {
                    image: imageUrl
                });

                setCurrentImage(imageUrl);
                Alert.alert('Success', 'Pet image updated successfully!');
            } catch (error) {
                console.error('Error updating image:', error);
                Alert.alert('Error', 'Failed to update image. Please try again.');
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Image Section */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: currentImage }} style={styles.image} />
                    <TouchableOpacity
                        style={styles.editImageButton}
                        onPress={handleUpdateImage}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <ActivityIndicator color={COLORS.white} size="small" />
                        ) : (
                            <Ionicons name="camera" size={20} color={COLORS.white} />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="chevron-back" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.favoriteButton}>
                        <Ionicons name="heart-outline" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>

                {/* Content Section */}
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.name}>{pet.name}'s Profile</Text>
                            <Text style={styles.breed}>{pet.breed}</Text>
                        </View>
                        <View style={styles.ageBadge}>
                            <Text style={styles.ageText}>{pet.age}</Text>
                        </View>
                    </View>

                    {/* Stats Section */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{pet.sex || 'Male'}</Text>
                            <Text style={styles.statLabel}>Sex</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{pet.weight || 'N/A'}</Text>
                            <Text style={styles.statLabel}>Weight</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>Healthy</Text>
                            <Text style={styles.statLabel}>Status</Text>
                        </View>
                    </View>

                    {/* Medical Records Section */}
                    <Text style={styles.sectionTitle}>Medical Records</Text>
                    {pet.medicalRecords?.map(record => (
                        <View key={record.id} style={styles.recordCard}>
                            <View style={styles.recordIcon}>
                                <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />
                            </View>
                            <View style={styles.recordInfo}>
                                <Text style={styles.recordTitle}>{record.title}</Text>
                                <Text style={styles.recordDate}>{record.date}</Text>
                            </View>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>{record.status}</Text>
                            </View>
                        </View>
                    ))}

                    {/* Vaccinations Section */}
                    <Text style={[styles.sectionTitle, { marginTop: SPACING.l }]}>Vaccinations</Text>
                    {pet.vaccinations?.map(vaccine => (
                        <View key={vaccine.id} style={styles.recordCard}>
                            <View style={[styles.recordIcon, { backgroundColor: '#E1F5FE' }]}>
                                <Ionicons name="shield-checkmark-outline" size={20} color="#0288D1" />
                            </View>
                            <View style={styles.recordInfo}>
                                <Text style={styles.recordTitle}>{vaccine.name}</Text>
                                <Text style={styles.recordDate}>Last: {vaccine.date}</Text>
                            </View>
                            <View style={styles.nextDueBadge}>
                                <Text style={styles.nextDueText}>Due: {vaccine.nextDue}</Text>
                            </View>
                        </View>
                    ))}

                    {/* About Section */}
                    <Text style={[styles.sectionTitle, { marginTop: SPACING.l }]}>About {pet.name}</Text>
                    <Text style={styles.aboutDescription}>
                        {pet.bio || `${pet.name} is a wonderful ${pet.breed}.`}
                    </Text>

                    {/* Action Button */}
                    <TouchableOpacity style={styles.contactButton}>
                        <Text style={styles.contactButtonText}>Update Records</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    imageContainer: {
        position: 'relative',
        height: 400,
        width: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    editImageButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: COLORS.primary,
        padding: 12,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: COLORS.white,
        padding: 10,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    favoriteButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: COLORS.white,
        padding: 10,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    content: {
        padding: SPACING.l,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.l,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    breed: {
        fontSize: 16,
        color: COLORS.textLight,
        marginTop: 4,
    },
    ageBadge: {
        backgroundColor: '#FFE5E5',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 15,
    },
    ageText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
    },
    statItem: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 20,
        width: '30%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.m,
    },
    recordCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 12,
        borderRadius: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    recordIcon: {
        width: 40,
        height: 40,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordInfo: {
        flex: 1,
        marginLeft: 12,
    },
    recordTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    recordDate: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 2,
    },
    statusBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 11,
        color: '#2E7D32',
        fontWeight: 'bold',
    },
    nextDueBadge: {
        backgroundColor: '#FFF3E0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    nextDueText: {
        fontSize: 11,
        color: '#EF6C00',
        fontWeight: 'bold',
    },
    aboutDescription: {
        fontSize: 15,
        color: COLORS.textLight,
        lineHeight: 22,
        marginBottom: SPACING.xl,
    },
    contactButton: {
        backgroundColor: COLORS.primary,
        padding: 18,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: SPACING.xl,
    },
    contactButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PetDetailScreen;
