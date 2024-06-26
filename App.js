import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as SplashScreen from 'expo-splash-screen';
import domtoimage from 'dom-to-image';
import { useState, useRef } from 'react';
import CircleButton from './components/CircleButton';
import IconButton from './components/iconButton';
import EmojiPicker from './components/EmojiPicker';
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';
import { GestureHandlerRootView } from "react-native-gesture-handler";


export default function App() {
  const [showAppOptions, setOptions] = useState(false);
  const imageRef = useRef();
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const placeholderImage = require('./assets/assets/images/background-image.png');
  const [selectedImage, setSelectedImg] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);

  if (status === null ) requestPermission();

  const onReset = () => {
    setOptions(false);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onAddSticker = () => {
    setIsModalVisible(true)
  };

  const onSaveImageAsync = async () => {
    if(Platform.os !== 'web'){
      try {
        const photoUri = await captureRef(imageRef, {
          height: 440,
          quality: 1
        })
  
        await MediaLibrary.saveToLibraryAsync(photoUri);
        if (photoUri){
          alert("Saved!");
        }
      }
      catch (e){
        console.log(e);
      }
    }
    else {
      try{
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        })

        let link = document.createElement('a')
        link.download = 'sticker-smash.jpeg';
        link.href = dataUrl;
        link.click();
      }
      catch (e){
        console.log(e);
      }
    }
  };

  // SplashScreen.preventAutoHideAsync();
  // setTimeout(SplashScreen.hideAsync, 1000);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled){
      setSelectedImg(result.assets[0].uri);
      setOptions(true);
    }
    else {
      alert('You did not select any image')
    }
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer placeholderImageSource={placeholderImage} 
          selectedImage={selectedImage}
          />
          {pickedEmoji && <EmojiSticker imageSize={50} stickerSource={pickedEmoji} />}
        </View>
      </View>
    {showAppOptions ? (
      <View style={styles.optionsContainer}>
        <View style={styles.optionsRow}>
          <IconButton icon="refresh" label="Reset" onPress={onReset} />
          <CircleButton onPress={onAddSticker} />
          <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
        </View>
    </View>
    ): (
      <View styles={styles.btnContainer}>
        <Button theme="primary" label="Choose a photo" onPress={pickImageAsync}/>
        <Button label="Use this photo" onPress={() => setOptions(true)}/>
      </View>
    )}  
    
    <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
      <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose}/>
    </EmojiPicker>

    <StatusBar style='light'/>
    </GestureHandlerRootView>
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
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
