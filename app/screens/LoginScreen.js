import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Alert,
  Button,
  Image
} from 'react-native';
import { StackNavigator, NavigationActions} from 'react-navigation';
const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
  AccessToken,
  LoginButton
} = FBSDK;
import images from '../utils/images';

class HomeScreen extends Component {
    constructor() {
        super();

        this.state = {
            loading: true,
        }


    }

    componentWillMount(){
        this.isLogged(() => {this.goHome();})
    }

    render() {
        return (<View style={{justifyContent:'center',backgroundColor:'#4082ed', height:'100%', width:'100%'}}>
                    <View style={{height:'30%', paddingTop:20, paddingBottom:20, marginBottom:100}}>
                          <Image
                              style={{height: '100%', width: undefined}}
                              source={images.logo}
                              resizeMode={"contain"}
                          />
                    </View>
                    <View style={{alignItems:'center', width:'100%'}}>
                      <Button
                          onPress={() => {this.loginFaceRead()}}
                          title="Login"
                          accessibilityLabel = "Open Camera"
                          style={{width:400}}
                      />
                    </View>
                </View>);
    }

    loginFaceRead(){
      var context = this;
      LoginManager.logInWithReadPermissions(["pages_show_list", "user_events", "email"]).then(
          function(result) {
            if (result.isCancelled) {
              alert('Login cancelled');
              console.log("Cancelado");
            } else {
                setTimeout(function(){
                    context.loginFaceWrite();
                }, 800)
            }
          },
          function(error) {
            console.log("ERRO");
            alert('Login fail with error: ' + error);
            if(AccessToken.getCurrentAccessToken != null){
              LoginManager.logOut();
            }
          }
        );
    }

    loginFaceWrite(){
      context = this;
      LoginManager.logInWithPublishPermissions(['publish_actions', "manage_pages", "publish_pages"]).then(
                    function(result) {
                      if (result.isCancelled) {
                        alert('Login cancelled');
                        if(AccessToken.getCurrentAccessToken != null){
                          LoginManager.logOut();
                        }
                      } else {
                        console.log("LOGIN PUBLISH");
                        context.goHome();
                      }
                    },
                    function(error) {
                      if(AccessToken.getCurrentAccessToken != null){
                        LoginManager.logOut();
                      }
                      alert('Login fail with error: ' + error);
                    });
    }

    isLogged(callback){
      AccessToken.getCurrentAccessToken().then((token) => {
        if(token != null){
          console.log(token.accessToken); 
          callback();
        }
      }).catch(err => {console.log(err)});      
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
}

export default HomeScreen;