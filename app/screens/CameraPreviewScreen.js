import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  Dimensions
} from 'react-native';
import { StackNavigator, NavigationActions} from 'react-navigation';
const FBSDK = require('react-native-fbsdk');
const {
  GraphRequest,
  GraphRequestManager
} = FBSDK;
import {NativeModules} from 'react-native';
import {
    Loading
} from '../components';


class CameraPreviewScreen extends Component {
    constructor() {
        super();

        this.state = {
            loading: true,
            user: '',
            friends: [],
            myId: 2,
            orientation: ''
        }
    }

    componentWillMount(){

    }
    componentDidMount(){
      //NativeModules.ImageProcessor.imageProcess(this.props.navigation.state.params.path, "","SCREEN_ORIENTATION_PORTRAIT",
      //    ()=>{console.log("Imagem processada");});
      //    
      setTimeout(()=>{console.log(global.PicturePath);
        if(global.PicturePath != ""){
        NativeModules.ImageProcessor.imageProcess(global.PicturePath, "","SCREEN_ORIENTATION_PORTRAIT",
          (file, result)=>{console.log(result); this.setState({loading:false, filePath:"file://"+result})});
        }else{
          this.componentWillMount();
        }}, 0);
      
    }

    render() {
        if(!this.state.loading){
          return (<View style={styles.container}>
            <Image
              source={{uri:this.state.filePath}}
              style={styles.preview}
            />
            <View style={styles.optionBar}>
              <Text style={styles.textButton} onPress={()=>{NativeModules.ImageProcessor.deleteFile(this.state.filePath); this.goBack()}}>Cancelar</Text>
              <Text style={styles.textButton} onPress={()=>{setTimeout(()=>{this.storePicture()}, 50); this.setState({loading:true});}}>Continuar</Text>
            </View>
          </View>);
        }else{
          return(<Loading loading={true} text="Aguarde enquanto preparamos a imagem"/>);
        }
    }

    goBack(){
      this.props.navigation.goBack();
    }

    goHome(){
      this.props
           .navigation
           .dispatch(NavigationActions.reset(
            {
               index: 0,
               actions: [
                 NavigationActions.navigate({ routeName: 'Home'})
                ]
            }));
    }

    storePicture(){
      context = this;
      if (this.state.filePath) {
        // Create the form data object
        var data = new FormData();
        data.append('picture', {uri:this.state.filePath, name: 'selfie.jpg', type: 'image/png'});
        data.append('nome', "VINICIUS");
        var url = "https://graph.facebook.com/"+global.pageID+"/photos?access_token=" + global.my_pageToken;
        console.log(url);
        fetch(url, {
          method: 'POST',
          body: data
        })
         .then((responseData) => {
             context.goHome();             
             console.log(responseData.json());
         })
         .catch(err => {
           console.log(err);
         });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',
    width: '100%'
  },
  textButton:{
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    borderRadius: 5,
    textAlign:'center',
    paddingBottom: 0,
    paddingTop: 10,
    marginLeft: 10,
    marginRight: 10,
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

export default CameraPreviewScreen;