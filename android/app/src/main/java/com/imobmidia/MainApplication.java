package com.imobmidia;

import android.app.Application;

import com.imobmidia.IMobMidiaPackage;
import com.facebook.react.ReactApplication;
import com.react.rnspinkit.RNSpinkitPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;


import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSpinkitPackage(),
          new OrientationPackage(),
          new RCTCameraPackage(),
          new FBSDKPackage(mCallbackManager),
          new IMobMidiaPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    // Initialize the SDK before executing any other operations.
    FacebookSdk.sdkInitialize(getApplicationContext());
    // Use AppEventsLogger to log custom events.
    AppEventsLogger.activateApp(this);
  }
}
