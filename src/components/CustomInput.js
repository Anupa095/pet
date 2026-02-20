import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../utils/theme';

const CustomInput = ({ iconName, placeholder, value, onChangeText, secureTextEntry, ...props }) => (
    <View style={styles.container}>
        {iconName && <Ionicons name={iconName} size={20} color={COLORS.textLight} style={styles.icon} />}
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textLight}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            {...props}
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: SPACING.m,
        marginBottom: SPACING.m,
        height: 55,
    },
    icon: {
        marginRight: SPACING.s,
    },
    input: {
        flex: 1,
        color: COLORS.text,
        fontSize: 16,
    },
});

export default CustomInput;
