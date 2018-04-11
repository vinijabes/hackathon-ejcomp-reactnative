package com.imobmidia;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.drawable.BitmapDrawable;
import android.media.ExifInterface;
import android.os.Environment;
import android.provider.MediaStore;
import android.os.AsyncTask;
import android.app.ProgressDialog;
import android.view.Display;
import android.view.Surface;
import android.view.WindowManager;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.HashMap;

import retrofit2.Call;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ImageProcessor extends ReactContextBaseJavaModule {

  private static final String PORTRAIT = "PORTRAIT";
  private static final String LANDSCAPE = "LANDSCAPE";
  private static final String IMAGE_URL = "URL";
  private static final String TEMPLATE_FOLDER = "Templates";
  private ReactApplicationContext context;

  Services services;
  String email;
  Bitmap moldura;
  ProgressDialog mProgressDialog;

  public ImageProcessor(ReactApplicationContext reactContext) {
    super(reactContext);
    this.context = reactContext;
  }

   @Override
  public String getName() {
    return "ImageProcessor";
  }

   @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    return constants;
  }

  @ReactMethod
  public void show(String filePath, Callback callback) {
    Bitmap result = this.LoadImage(filePath);
    Boolean resultado = result != null;
    callback.invoke(resultado);
  }

  @ReactMethod
  public void imageProcess(String filePath, String email, String orientation, Callback callback){
    Bitmap image = LoadImage(filePath);
    if(image == null){
      callback.invoke(filePath, "CAN'T FIND THE IMAGE: "+filePath, 0, 0);  
      return;
    }
    if(orientation.equals("SCREEN_ORIENTATION_PORTRAIT")){
        //image = this.RotateBitmap(image, 90);
    }else if(orientation.equals("SCREEN_ORIENTATION_LANDSCAPE")){
        //image = this.RotateBitmap(image, 360);
    }else if(orientation.equals("SCREEN_ORIENTATION_REVERSE_PORTRAIT")){
        //image = this.RotateBitmap(image, 270);
    }else if(orientation.equals("SCREEN_ORIENTATION_REVERSE_LANDSCAPE")){
        //image = this.RotateBitmap(image, 180);
    }
    String pathImage = DownloadFiles(email);
    //image = CropImage(image, 60, 480, 960, 960);
    Bitmap image2 = LoadImage(pathImage);
    if(image2 == null){
      callback.invoke(filePath, "CAN'T FIND THE IMAGE: "+pathImage, 0, 0);  
      return;
    }
    image2 = ResizedBitmap(image2, image.getWidth(),image.getHeight());
    Bitmap resultBmp = this.overlayBitmap(image, image2);
    //resultBmp = ResizedBitmap(resultBmp, 960, 960);    
    String result = this.saveToInternalStorage(resultBmp, "Files");
    replaceExifTag(result, ExifInterface.TAG_ORIENTATION, "TESTE");
    this.deleteFile(filePath);
    callback.invoke(filePath, result, image.getWidth(), image.getHeight());
  }

  @ReactMethod
  public void SaveImage(String filePath, Boolean isPortrait, Callback callback){
    Bitmap image = LoadImage(filePath);    
    if(isPortrait)
        image = this.RotateBitmap(image, 90);
    else
        image = this.RotateBitmap(image, 180);
    String result = this.saveToInternalStorage(image, "Files");
    this.deleteFile(filePath);
    callback.invoke();
  }

  private Bitmap CropImage(Bitmap bitmap, int startX, int startY, int endX, int endY){
    Bitmap Cropped = Bitmap.createBitmap(bitmap, startX, startY, endX, endY);
    return Cropped;
  }

  private File getOutputMediaFile(String Folder){
    // To be safe, you should check that the SDCard is mounted
    // using Environment.getExternalStorageState() before doing this. 
    File mediaStorageDir = new File("/storage/emulated/0/Pictures/"
            + this.context.getApplicationContext().getPackageName()
            + "/" + Folder); 

    // This location works best if you want the created images to be shared
    // between applications and persist after your app has been uninstalled.

    // Create the storage directory if it does not exist
    if (! mediaStorageDir.exists()){
        if (! mediaStorageDir.mkdirs()){
            return null;
        }
    } 
    // Create a media file name
    String timeStamp = new SimpleDateFormat("ddMMyyyy_HHmmss").format(new Date());
    File mediaFile;
        String mImageName="MI_"+ timeStamp +".png";
        mediaFile = new File(mediaStorageDir.getPath() + File.separator + mImageName);  
    return mediaFile;
  } 

  private Bitmap ResizedBitmap(Bitmap bitmap, int width, int height){
     Bitmap newBitmap = Bitmap.createScaledBitmap(bitmap, width,
            height, false);
     return newBitmap;
  }

  private String saveToInternalStorage(Bitmap bitmapImage, String folder){
        OutputStream fOut = null;
        Integer counter = 0;
        try {
          File file = this.getOutputMediaFile(folder);
          fOut = new FileOutputStream(file);

          bitmapImage.compress(Bitmap.CompressFormat.PNG, 100, fOut); // saving the Bitmap to a file compressed as a JPEG with 85% compression rate
          //fOut.flush(); // Not really required
          fOut.close(); // do not forget to close the stream
          return file.getAbsolutePath();
        }catch (Exception exception){
          return "FAILED";
        }
    }

    private Bitmap overlayBitmap(Bitmap bmp1, Bitmap bmp2) {
        Bitmap bmOverlay = bmp1.copy(bmp1.getConfig(), true);
        Canvas canvas = new Canvas(bmOverlay);
        canvas.drawBitmap(bmp1, new Matrix(), null);
        canvas.drawBitmap(bmp2, 0, 0, null);
        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        bmOverlay.compress(Bitmap.CompressFormat.PNG, 100, stream);
        return bmOverlay;
    }

    public static Bitmap RotateBitmap(Bitmap source, float angle)
    {
          Matrix matrix = new Matrix();
          matrix.postRotate(angle);
          return Bitmap.createBitmap(source, 0, 0, source.getWidth(), source.getHeight(), matrix, true);
    }
  protected Bitmap LoadImage(String URI){
      String filePath = URI.replace("file://", "");
      //File imgFile = new  File(filePath);
      Bitmap myBitmap = BitmapFactory.decodeFile(filePath);
      return myBitmap;
  }

  @ReactMethod
  public Boolean deleteFile(String path){
    String filePath = path.replace("file://", "");
    File file = new File(filePath);
    boolean deleted = file.delete();
    return deleted;
  }

  ///
  ///
  @ReactMethod
  public void getScreenRotationOnPhone(Callback callback) {

    final Display display = ((WindowManager) context.getSystemService(Context.WINDOW_SERVICE)).getDefaultDisplay();
    switch (display.getRotation()) {
        case Surface.ROTATION_0:
            callback.invoke("SCREEN_ORIENTATION_PORTRAIT");
            break;

        case Surface.ROTATION_90:
            callback.invoke("SCREEN_ORIENTATION_LANDSCAPE");
            break;

        case Surface.ROTATION_180:
            callback.invoke("SCREEN_ORIENTATION_REVERSE_PORTRAIT");
            break;

        case Surface.ROTATION_270:
            callback.invoke("SCREEN_ORIENTATION_REVERSE_LANDSCAPE");
            break;
    }
  }
  //********************************************************************//
  //************************IMAGE-INFO SECTION**************************//
  //********************************************************************//
    public void replaceExifTag(String filePath, String tag, String value) {
        ExifInterface mExif = loadExifData(filePath);
        mExif.setAttribute(tag, value);
        try{
            mExif.saveAttributes();
        }catch(Exception err){

        }
    } 
 
    private ExifInterface loadExifData(String filePath) { 
        ExifInterface mExif = null;
        try { 
            mExif = new ExifInterface(filePath);
        } catch (IOException ex) {
            
        }
        return mExif; 
    } 


  //*********************************************************************//
  //*************************RETRO-FIT SECTION***************************//
  //*********************************************************************//
  
  private File getAppFolder(String Folder){
    File mediaStorageDir = new File("/storage/emulated/0/Pictures/"
            + this.context.getApplicationContext().getPackageName()
            + "/" + Folder); 

    if (! mediaStorageDir.exists()){
        if (! mediaStorageDir.mkdirs()){
            return null;
        }
    }

    return mediaStorageDir;
  }



  private String getFileName(){
    String timeStamp = new SimpleDateFormat("ddMMyyyy_HHmmss").format(new Date());
    String mImageName="MI_"+ timeStamp +".png";
    return mImageName;
  }

  private Boolean fileExists(String folder, String fileName){
    File mediaStorageDir = getAppFolder(folder);
    File file = new File(mediaStorageDir.getPath() + File.separator + fileName);
    return file.exists();
  }

  private Boolean templateExists(String fileName){
    return fileExists(TEMPLATE_FOLDER, fileName);
  }

  private String getAppPath(String folder){
      return getAppFolder(folder).getAbsolutePath();
  }

  private String getTemplate(String fileName){
      return getAppPath(TEMPLATE_FOLDER) +File.separator + fileName;
  }

  private File getOutputTemplateFile(String fileName){
    File mediaStorageDir = getAppFolder(TEMPLATE_FOLDER);
    File mediaFile;
    String mImageName=fileName;
    mediaFile = new File(mediaStorageDir.getPath() + File.separator + mImageName);  
    return mediaFile;
  }

  protected String saveTemplate(Bitmap bitmapImage, String fileName){
    OutputStream fOut = null;
    Integer counter = 0;
    try {
      File file = this.getOutputTemplateFile(fileName);
      fOut = new FileOutputStream(file);

      bitmapImage.compress(Bitmap.CompressFormat.PNG, 100, fOut); // saving the Bitmap to a file compressed as a JPEG with 85% compression rate
      //fOut.flush(); // Not really required
      fOut.close(); // do not forget to close the stream
      return file.getAbsolutePath();
    }catch (Exception exception){
      return "FAILED";
    }
  }
  protected String DownloadFiles(String email){
    Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(Services.URL_BASE)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

    services = retrofit.create(Services.class);
    email = "darlannakamura@hotmail.com";
    Call<String> requestTemplate = services.getTemplate(
            email
    );
    try{
        Response<String> response = requestTemplate.execute();
        if(!response.isSuccessful()){
            return "";
        }else{
            String template = response.body();
            String imageURL = template;
            String []segments = imageURL.split("/");
            Bitmap bitmap = null;
            if(templateExists(segments[segments.length-1])){
                return getTemplate(segments[segments.length-1]);
            }
            try {
                // Download Image from URL
                InputStream input = new java.net.URL(imageURL).openStream();
                // Decode Bitmap
                bitmap = BitmapFactory.decodeStream(input);
                return saveTemplate(bitmap, segments[segments.length - 1]);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

    }catch(Exception err){

    }
    return "";
  }

}