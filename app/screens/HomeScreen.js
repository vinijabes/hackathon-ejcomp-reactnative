import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  Button
} from 'react-native';
import { StackNavigator, NavigationActions} from 'react-navigation';
import Orientation from 'react-native-orientation';
const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager
} = FBSDK;
var Spinner = require('react-native-spinkit');
import {
    Loading
} from '../components';
import images from '../utils/images';
import { getName } from '../utils/fetch';

const styles = StyleSheet.create({
  circleButton: {
    margin:15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40,
    alignSelf:'flex-end'
  }
})

class HomeScreen extends Component {
    
    constructor() {
        super();

        this.state = {
            loading: false,
            user: '',
            friends: [],
            myId: 2,
            index: 11,
            types: ['CircleFlip', 'Bounce', 'Wave', 'WanderingCubes', 'Pulse', 'ChasingDots', 'ThreeBounce', 'Circle', '9CubeGrid', 'WordPress', 'FadingCircle', 'FadingCircleAlt', 'Arc', 'ArcAlt'],
            size: 100,
            color: "red",
            isVisible: true
            
        }


    }

    componentWillMount(){
      AccessToken.getCurrentAccessToken().then((token) => {
        global.my_token = token.accessToken ;
        infoRequest = new GraphRequest(
          '/me/accounts',
          {
            access_token: token.accessToken
          },
          (err, result) => {
            if(err){
              console.log("TOKEN_ERROR"+err);
            }else{
              console.log(result);
              global.pageID = result.data[0].id;
              global.my_pageToken = result.data[0].access_token;
              this.getName();
            }
          }
        );
        new GraphRequestManager().addRequest(infoRequest).start();
      });
      Orientation.unlockAllOrientations();
    }

    async getName(){
      const response = await getName(global.my_token);
      const user = await response.json();
      console.log(user);
      this.setState({
        name: user.name,
        loading: false
      })
    }
    render() {
      var type = this.state.types[this.state.index];
        if(!this.state.loading){
          return (<View style={{height:'100%', width:'100%', backgroundColor:'#b3cffc'}}>
                      <View style={{backgroundColor:'#4082ed', height:'30%', paddingTop:20, paddingBottom:20}}>
                          <Image
                              style={{height: '100%', width: undefined}}
                              source={images.logo}
                              resizeMode={"contain"}
                          />
                      </View>
                      <View style={{alignItems:'center'}}>
                        <Text>
                          <Text>Olá, </Text>
                          <Text style = {{fontFamily: 'opensans_bold'}}>{this.state.name}</Text>
                        </Text>
                      </View>
                      <View style={{position: 'absolute', bottom: 0, right:0, left:0}}>
                        <TouchableOpacity
                          style={styles.circleButton}
                          onPress={() => this.props.navigation.navigate('Camera')}
                        >
                          <Image
                              source={require('./assets/ic_photo_camera_36pt.png')}
                          />
                        </TouchableOpacity>
                      </View>
                  </View>);
        }else{
          return(<Loading loading={true} text="Aguarde"/>);
        }
    }
}

export default HomeScreen;