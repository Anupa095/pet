import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../utils/theme';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebaseConfig';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';

const HomeScreen = ({ navigation }) => {
    const { user, logout } = useAuth();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPets = async () => {
        try {
            const q = query(collection(db, 'pets'));
            const querySnapshot = await getDocs(q);
            const petsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPets(petsData);
        } catch (error) {
            console.error('Error fetching pets from Firestore:', error);
            Alert.alert('Firebase Error', error.message || 'Check your connection or security rules.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchPets();
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error(error);
        }
    };

    const renderPetItem = ({ item }) => (
        <TouchableOpacity
            style={styles.petCard}
            onPress={() => navigation.navigate('PetDetail', { pet: item })}
        >
            <Image source={{ uri: item.image }} style={styles.petImage} />
            <View style={styles.petInfo}>
                <Text style={styles.petName}>{item.name}</Text>
                <Text style={styles.petBreed}>{item.breed}</Text>
                <Text style={styles.petAge}>{item.age}</Text>
            </View>
            <TouchableOpacity style={styles.favButton}>
                <Ionicons name="heart-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Hello, {user?.email?.split('@')[0] || 'User'}!</Text>
                    <Text style={styles.headerTitle}>Your Pets</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={[styles.profileButton, { marginRight: SPACING.s }]} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={26} color={COLORS.error} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.profileButton}>
                        <Ionicons name="person-circle-outline" size={40} color={COLORS.text} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.searchBar}>
                <Ionicons name="search-outline" size={20} color={COLORS.textLight} />
                <Text style={styles.searchPlaceholder}>Search your pets...</Text>
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Pet Accounts</Text>
                <TouchableOpacity onPress={onRefresh}>
                    <Text style={styles.seeAllText}>Refresh</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={pets}
                    renderItem={renderPetItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 50, color: COLORS.textLight }}>No pets found. Add one!</Text>
                    }
                />
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddPet')}
            >
                <Ionicons name="add" size={30} color={COLORS.white} />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
        paddingTop: SPACING.l,
        marginBottom: SPACING.l,
    },
    welcomeText: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.text,
    },
    profileButton: {
        padding: SPACING.xs,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        marginHorizontal: SPACING.l,
        padding: SPACING.m,
        borderRadius: 15,
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    searchPlaceholder: {
        color: COLORS.textLight,
        marginLeft: SPACING.s,
        fontSize: 15,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
        marginBottom: SPACING.m,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    seeAllText: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    listContainer: {
        paddingHorizontal: SPACING.l,
        paddingBottom: 100,
    },
    petCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 20,
        marginBottom: SPACING.m,
        padding: SPACING.s,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    petImage: {
        width: 80,
        height: 80,
        borderRadius: 15,
    },
    petInfo: {
        flex: 1,
        marginLeft: SPACING.m,
    },
    petName: {
        fontSize: 17,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    petBreed: {
        fontSize: 14,
        color: COLORS.textLight,
        marginVertical: 2,
    },
    petAge: {
        fontSize: 13,
        color: COLORS.primary,
        fontWeight: '600',
    },
    favButton: {
        width: 35,
        height: 35,
        backgroundColor: COLORS.background,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.s,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: COLORS.primary,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
});

export default HomeScreen;
