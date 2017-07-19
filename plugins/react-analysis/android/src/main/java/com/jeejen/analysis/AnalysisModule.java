package com.jeejen.analysis;

import android.text.TextUtils;
import android.util.Log;

import com.baidu.crabsdk.CrabSDK;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.HashMap;

public class AnalysisModule extends ReactContextBaseJavaModule {
    public static final String TAG = "AnalysisModule";
    public AnalysisModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AnalysisModule";
    }

    @Override
    public void initialize() {
        super.initialize();
    }

    @ReactMethod
    public void setParams(ReadableMap data, Promise promise){
        try {
            String customDetail = data.getString("customMessage");
            if(TextUtils.isEmpty(customDetail)) {
                promise.reject("error", "param error");
                return;
            }
            HashMap<String, String> customMap = new HashMap<String, String>();
            customMap.put("customMessage", customDetail);
            CrabSDK.setUsersCustomKV(customMap);
            WritableMap map = new WritableNativeMap();
            map.putString("result", "success");
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject("error", "exception");
        }
    }
}
