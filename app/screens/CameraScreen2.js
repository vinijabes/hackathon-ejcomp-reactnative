import React, { Component } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Alert
} from 'react-native';
import Camera from 'react-native-camera';


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    
  },
  topOverlay: {
    
  },
  bottomOverlay: {
  },
  captureButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40,
  },
  typeButton: {
    padding: 5,
  },
  flashButton: {
    padding: 5,
  },
  buttonsSpace: {
    width: 10,
  },
});


class CameraScreen2 extends Component { 
  constructor(props) {
    super(props);

    this.camera = null;

    this.state = {
      camera: {
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.disk,
        type: Camera.constants.Type.back,
        orientation: Camera.constants.Orientation.auto,
        flashMode: Camera.constants.FlashMode.off,
        captureQuality: Camera.constants.CaptureQuality["1080p"],
      },
      isRecording: false,
    };

    Dimensions.addEventListener('change', () => {
        var h = Dimensions.get('window').height;
        var w = Dimensions.get('window').width;
        var isPortrait = false;
        if(h > w){
          isPortrait = true;
        }
        else{
        }
        this.setState({
          portrait: isPortrait
        });
    });
  }

  componentWillMount(){
    var h = Dimensions.get('window').height;
        var w = Dimensions.get('window').width;
        var isPortrait = false;
        if(h > w){
          isPortrait = true;
        }
        else{
        }
        this.setState({
          portrait: isPortrait
        });
  }

  takePicture() {
    console.log("WTF");
    global.PicturePath = "";
    if (this.camera) {
      console.log("Photo take")
      this.camera.capture()
        .then((data) => {
            global.PicturePath = data.path;
            this.props.navigation.navigate('Preview');
          })
        .catch(err => console.error(err));
    }else{
      console.log("CAMERA NÃO ENCONTRADA");
    }
  }

  switchType = () => {
    let newType;
    const { back, front } = Camera.constants.Type;

    if (this.state.camera.type === back) {
      newType = front;
    } else if (this.state.camera.type === front) {
      newType = back;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        type: newType,
      },
    });
  }

  get typeIcon() {
    let icon;
    const { back, front } = Camera.constants.Type;

    if (this.state.camera.type === back) {
      icon = require('./assets/ic_camera_rear_white.png');
    } else if (this.state.camera.type === front) {
      icon = require('./assets/ic_camera_front_white.png');
    }

    return icon;
  }

  switchFlash = () => {
    let newFlashMode;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      newFlashMode = on;
    } else if (this.state.camera.flashMode === on) {
      newFlashMode = off;
    } else if (this.state.camera.flashMode === off) {
      newFlashMode = auto;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        flashMode: newFlashMode,
      },
    });
  }

  get flashIcon() {
    let icon;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      icon = require('./assets/ic_flash_auto_white.png');
    } else if (this.state.camera.flashMode === on) {
      icon = require('./assets/ic_flash_on_white.png');
    } else if (this.state.camera.flashMode === off) {
      icon = require('./assets/ic_flash_off_white.png');
    }

    return icon;
  }

  dinamicStyle(){
    if(this.state.portrait){
      return{flexDirection: 'row'}
    }else{
      return{flexDirection: 'column'}
    }
  }

  topStyle(){
    if(this.state.portrait){
      return{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        top: 0,
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center',}
    }else{
      return{
        flex: 1,
        justifyContent: 'space-between',
        left: 0,
        position: 'absolute',
        padding: 16,
        bottom: 0,
        top: 0,
      }
    }
  }

  bottomSyle(){
    if(this.state.portrait){
      return{
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        bottom:0,
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center',}
    }else{
      return{
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        right:0,
        position: 'absolute',
        padding: 16,
        bottom: 0,
        top: 0,
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          animated
          hidden
        />
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={this.state.camera.aspect}
          captureTarget={Camera.constants.CaptureTarget.disk}
          type={this.state.camera.type}
          flashMode={this.state.camera.flashMode}
          captureQuality={this.state.camera.captureQuality}
          onFocusChanged={() => {}}
          onZoomChanged={() => {}}
          defaultTouchToFocus
          mirrorImage={false}
          fixOrientation={true}
        />
        <View style={[styles.overlay, styles.topOverlay, this.dinamicStyle(), this.topStyle()]}>
          <TouchableOpacity
            style={styles.typeButton}
            onPress={this.switchType}
          >
            <Image
              source={this.typeIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flashButton}
            onPress={this.switchFlash}
          >
            <Image
              source={this.flashIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.overlay, styles.bottomOverlay, this.dinamicStyle(), this.bottomSyle()]}>
          {
            <TouchableOpacity
                style={styles.captureButton}
                onPress={this.takePicture.bind(this)}
            >
              <Image
                  source={require('./assets/ic_photo_camera_36pt.png')}
              />
            </TouchableOpacity>
            ||
            null
          }
          
        </View>
      </View>
    );
  }
}



export default CameraScreen2;