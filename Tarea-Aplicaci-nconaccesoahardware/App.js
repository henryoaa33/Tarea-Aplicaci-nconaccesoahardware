import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import { Gyroscope } from 'expo-sensors';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [gyroscopeData, setGyroscopeData] = useState({});
  const [location, setLocation] = useState(null);

  useEffect(() => {

    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();

 
    const gyroscopeSubscription = Gyroscope.addListener((data) => {
      setGyroscopeData(data);
    });


    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      }
    })();


    Notifications.requestPermissionsAsync();

 
    return () => {
      gyroscopeSubscription.remove();
    };
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      let photo = await cameraRef.current.takePictureAsync();
      console.log('Photo taken:', photo);
 
    }
  };

  const playAudio = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/audio/sample.mp3')
    );
    await sound.playAsync();
  };

  return (
    <View style={styles.container}>
      <Text>Hardware Access Example</Text>
      {hasCameraPermission === null ? (
        <Text>Requesting camera permission...</Text>
      ) : hasCameraPermission === false ? (
        <Text>No access to camera</Text>
      ) : (
        <View>
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.back}
            ref={(ref) => (cameraRef = ref)}
          />
          <Button title="Take Picture" onPress={takePicture} />
        </View>
      )}

      <Text>Gyroscope Data: {JSON.stringify(gyroscopeData)}</Text>

      {location && (
        <Text>
          Location: {location.coords.latitude}, {location.coords.longitude}
        </Text>
      )}

      <Button title="Play Audio" onPress={playAudio} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: 300,
    height: 300,
  },
});

