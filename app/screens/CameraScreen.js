import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import {NativeModules} from 'react-native';
import Camera from 'react-native-camera';
import Orientation from 'react-native-orientation';

import {
    Loading
} from '../components';

class CameraScreen extends Component {
    constructor() {
        super();

        this.state = {
            loading: false,
        }

        Dimensions.addEventListener('change', () => {
  	    	var h = Dimensions.get('window').height;
  			  var w = Dimensions.get('window').width;
  	      var isPortrait = false;
          NativeModules.ImageProcessor.getScreenRotationOnPhone(
            (orientation)=>{
              this.setState({
                orientation: orientation
              });
              console.log(orientation)
            });
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
      const initial = Orientation.getInitialOrientation();
      this.setState({
          orientation: initial
      }); 
    }

    componentWillUnmount(){
    }

    componentDidMount(){
      NativeModules.ImageProcessor.getScreenRotationOnPhone(
       (orientation)=>{
          this.setState({
          orientation: orientation
        });
        console.log(orientation)
      });
      var h = Dimensions.get('window').height;
      var w = Dimensions.get('window').width;
      var isPortrait = false;
      if(h > w){
        isPortrait = true;
        //Orientation.unlockAllOrientations();
        //Orientation.lockToPortrait();
      }
      else{
        //Orientation.lockToLandscapeLeft();
      }
      this.setState({
          portrait: isPortrait
      });
      //Orientation.lockToPortrait();
      Orientation.addOrientationListener((orientation) =>{
        console.log(orientation);
        this.setState({
          orientation: orientation
        });
      });
    }


    render() {
      if(!this.state.loading){
              return (
            <View style={styles.container}>
             <Camera
                 ref={(cam) => {
                   this.camera = cam;
                 }}
                 
                 style={this.preview()}
                 aspect={Camera.constants.Aspect.stretch}
                 captureTarget={Camera.constants.CaptureTarget.disk}
                 captureQuality={Camera.constants.CaptureQuality["1080p"]}
                 orientation={Camera.constants.Orientation.auto}
                 fixOrientation={true}
                 >
                 <View style = {styles.optionBar}>
                     <Text style={styles.textButton} onPress={this.goBack.bind(this)}>Voltar</Text>
                     <Text style={styles.textButton} onPress={this.takePicture.bind(this)}>Capturar</Text>
                  </View>
             </Camera>
            </View>);
        }else{
          return(<Loading loading={true} text="Aguarde"/>);     
        }
    }

    preview(){
    	var h = Dimensions.get('window').height;
    	var w = Dimensions.get('window').width;
    	return {
		   flex: 1,
		   width: '100%',
		   height: '100%'
		 }
    }
	async takePicture() {
	 console.log("Taking Photo");
   context = this;
   this.setState({
      loading:true
   });
   await this.camera.capture()
     .then((data) => {
        context.setState({
          loading:true
        });
        console.log(data);
        PicturePath = data.path;
        console.log(this.state.portrait);
        NativeModules.ImageProcessor.imageProcess(PicturePath,"Brabra",this.state.orientation,
            (filePath, result, width, height) => 
            {
                console.log(result);console.log(width);
                console.log(height);
                this.props.navigation.navigate('Preview',{path:'file://'+result});
            })
        }).catch(err => console.error(err));
  }

  goBack(){
    this.props.navigation.goBack();
  }   
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  preview: {
   flex: 1,
   justifyContent: 'flex-end',
   alignItems: 'center',
   
 },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  textButton:{
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    borderRadius: 5,
    textAlign:'center',
    paddingBottom: 0,
    paddingTop: 10,
    marginLeft: 20,
    marginRight: 20,
    height:40,
    width:200,
  },
  optionBar:{
    flex:0,
    flexDirection:'row',
    height: 50,
    position:'absolute',
    left:0,
    right:0,
    bottom:0,
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
});

export default CameraScreen;