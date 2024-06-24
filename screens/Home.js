import React, { useEffect } from 'react';
import { View, StyleSheet, Alert, BackHandler } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../services/auth/auth';

const Home = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Log Out",
        "Do you want to log out?",
        [
          {
            text: "No",
            onPress: () => null,
            style: "cancel"
          },
          { 
            text: "Yes", 
            onPress: async () => {
              await logout();
              navigation.navigate('Login');
            }
          }
        ]
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('AnotherScreen')} 
        style={styles.button}>
        Go to Another Screen
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    marginTop: 16,
    padding: 8,
  },
});

export default Home;
