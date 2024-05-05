import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

export default function App() {
  const placeholderImage = require('./assets/assets/images/background-image.png');
  const [selectedImage, setSelectedImg] = useState(null);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled){
      setSelectedImg(result.assets[0].uri);
    }
    else {
      alert('You did not select any image')
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer placeholderImageSource={placeholderImage} 
         selectedImage={selectedImage}
        />
      </View>

      <View styles={styles.btnContainer}>
        <Button theme="primary" label="Choose a photo" onPress={pickImageAsync}/>
        <Button label="Use this photo"/>
      </View>
      
      <StatusBar style='light'/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  btnContainer: {
    flex: 1/3,
    alignItems: 'center',
  },
});
