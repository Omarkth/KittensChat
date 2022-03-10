// In App.js in a new project

import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { NavigationContainer, useNavigation, NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CallScreen from './Call'

const Item = ({ item, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item]}>
        <Text style={[styles.title]}>{item.text}</Text>
    </TouchableOpacity>
);

function HomeScreen({ navigation }) {
    const [channels, setChannels] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchData = () => {
        setIsLoading(true)
        fetch('https://classime.com/api/item')
            .then(response => {
                return response.json()

            })
            .then(data => {
                setIsLoading(false)
                setChannels(data)
            })
    }

    useEffect(() => {
        fetchData()
    }, [])

    const renderItem = ({ item }) => {

        return (
            <Item
                item={item}
                onPress={() => navigation.navigate('Call', item )}
            />
        );
    };
    return (
        <SafeAreaView style={styles.container}>
            {isLoading && <ActivityIndicator size="large" />}
            {channels.length > 0 && (
                <FlatList
                    data={channels}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            )}
        </SafeAreaView>
    );
}

const Stack = createNativeStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Call" component={CallScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
});

export default App;