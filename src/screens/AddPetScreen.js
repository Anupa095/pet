import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../utils/theme';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';

const AddPetScreen = ({ navigation }) => {
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
                        <TouchableOpacity style={styles.imagePlaceholder}>
                            <Ionicons name="camera-outline" size={40} color={COLORS.textLight} />
                            <Text style={styles.uploadText}>Upload Photo</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        <CustomInput
                            iconName="pencil-outline"
                            placeholder="Pet Name"
                        />
                        <CustomInput
                            iconName="paw-outline"
                            placeholder="Pet Type (e.g. Dog, Cat)"
                        />
                        <CustomInput
                            iconName="ribbon-outline"
                            placeholder="Breed"
                        />
                        <CustomInput
                            iconName="calendar-outline"
                            placeholder="Age"
                            keyboardType="numeric"
                        />

                        <View style={styles.spacer} />

                        <CustomButton
                            title="Save Pet"
                            onPress={() => navigation.goBack()}
                        />
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
