import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING } from '../utils/theme';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { db } from '../services/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { uploadImage } from '../services/imageService';

const AddPetScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [bio, setBio] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!name || !type || !breed || !age) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            let imageUrl = 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000&auto=format&fit=crop'; // Default placeholder

            if (image) {
                const fileName = `pets/${Date.now()}_${name}.jpg`;
                imageUrl = await uploadImage(image, fileName);
            }

            await addDoc(collection(db, 'pets'), {
                name,
                type,
                breed,
                age,
                weight: weight || 'N/A',
                bio: bio || `${name} is a wonderful ${breed}.`,
                image: imageUrl,
                medicalRecords: [],
                vaccinations: [],
                createdAt: serverTimestamp(),
            });

            Alert.alert('Success', 'Pet added successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Error adding pet: ', error);
            Alert.alert('Error', 'Failed to save pet. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.title}>Add New Pet</Text>
                        <Text style={styles.subtitle}>Tell us about your furry friend!</Text>
                    </View>

                    <View style={styles.imageUploadContainer}>
                        <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.selectedImage} />
                            ) : (
                                <>
                                    <Ionicons name="camera-outline" size={40} color={COLORS.textLight} />
                                    <Text style={styles.uploadText}>Upload Photo</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        <CustomInput
                            iconName="pencil-outline"
                            placeholder="Pet Name"
                            value={name}
                            onChangeText={setName}
                        />
                        <CustomInput
                            iconName="paw-outline"
                            placeholder="Pet Type (e.g. Dog, Cat)"
                            value={type}
                            onChangeText={setType}
                        />
                        <CustomInput
                            iconName="ribbon-outline"
                            placeholder="Breed"
                            value={breed}
                            onChangeText={setBreed}
                        />
                        <CustomInput
                            iconName="calendar-outline"
                            placeholder="Age"
                            keyboardType="numeric"
                            value={age}
                            onChangeText={setAge}
                        />
                        <CustomInput
                            iconName="barbell-outline"
                            placeholder="Weight (Optional)"
                            value={weight}
                            onChangeText={setWeight}
                        />
                        <CustomInput
                            iconName="chatbubble-outline"
                            placeholder="Short Bio (Optional)"
                            value={bio}
                            onChangeText={setBio}
                            multiline
                        />

                        <View style={styles.spacer} />

                        {loading ? (
                            <ActivityIndicator size="large" color={COLORS.primary} />
                        ) : (
                            <CustomButton
                                title="Save Pet"
                                onPress={handleSave}
                            />
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: SPACING.l,
    },
    backButton: {
        marginTop: SPACING.m,
        marginBottom: SPACING.l,
    },
    header: {
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
    },
    imageUploadContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    imagePlaceholder: {
        width: 120,
        height: 120,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
        overflow: 'hidden',
    },
    selectedImage: {
        width: '100%',
        height: '100%',
    },
    uploadText: {
        color: COLORS.textLight,
        fontSize: 12,
        marginTop: SPACING.xs,
    },
    form: {
        width: '100%',
    },
    spacer: {
        height: SPACING.l,
    },
});

export default AddPetScreen;
