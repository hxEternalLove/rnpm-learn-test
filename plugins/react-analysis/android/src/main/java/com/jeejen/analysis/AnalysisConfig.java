package com.jeejen.analysis;

import android.app.Application;
import android.util.Log;

import com.baidu.crabsdk.CrabSDK;
import com.baidu.crabsdk.OnAnrCrashListener;
import com.baidu.crabsdk.OnCrashExceedListener;

import java.util.HashMap;
import java.util.Map;

/**
 * Author:  jeejen
 * Email:   a4247256@126.com
 * Date:    17-1-16.
 * Description:
 */
public class AnalysisConfig {

    public static void doApplicationConfig(Application application, String appKey) {
        // 在打开app初始化时回调，故此方法要再init之前调用
        // 不设置的情况下默认值是-1，即为关闭，故实现接口前必须设置CrabSDK.setConstantSameCrashExceedLimit(3);且>0时回调才有效
        CrabSDK.setConstantSameCrashExceedLimit(3);
        CrabSDK.setOnCrashExceedListener(new OnCrashExceedListener() {
            @Override
            public void onCrashExceedCallback() {
            }
        });
        // ------------------------------------------------------------------------------------------
        // 初始化sdk，传入appkey；appkey需要去品台申请，详情参见：https://crab.baidu.com/
        CrabSDK.init(application, appKey);
        // 开启卡顿捕获功能, 传入每天上传卡顿信息个数，-1代表不限制, 已自动打开
        CrabSDK.enableBlockCatch(-1);
        // 关闭卡顿功能，默认时间
        // 自定义卡顿阈值，默认是2000ms，强烈建议阈值不宜小于500ms
        CrabSDK.setBlockThreshold(2000);
        // 设置行为记录功能，在BaseActivity中调用 CrabSDK.dispatchTouchEvent(event, this)即为开启
        // 设置行为记录最大条目（不设置的情况下默认值为5）
        CrabSDK.setBehaviorRecordLimit(8);
        // 设置行为记录功能，在BaseActivity中调用 CrabSDK.urlRecordEvent(event, this)即为开启
        // 设置行为记录最大条目（不设置的情况下默认值为10）
        CrabSDK.setUrlRecordLimit(8);
        //以下是对可配置参数的设置，详情请参见平台安装指南：http://crab.baidu.com/wiki/sdk
        // 设置同一crash一天上传的上限，-1代表无上限，默认是10
        CrabSDK.setUploadLimitOfSameCrashInOneday(-1);
        // 设置一天上传的crash总数上限，-1代表无上限，默认是30
        CrabSDK.setUploadLimitOfCrashInOneday(-1);
        // 设置一天上传anr的上限，-1代表无上限，默认是10
        CrabSDK.setUploadLimitOfAnrInOneday(-1);
        // 设置渠道号
        CrabSDK.setChannel("Jeejen");
        // 开启ndk捕获功能，默认关闭，
        // 若app涉及NDK编程，可去平台下载NativeSDK集成后，打开此开关即可
        // 开启截屏收集功能，默认关闭
        CrabSDK.setCollectScreenshot(true);
        // 设置crab的log开关，默认开启
        CrabSDK.setEnableLog(true);

        // 设置对crash anr发生时回调接口
        CrabSDK.setOnAnrCrashListener(new OnAnrCrashListener() {
            @Override
            public void onAnrStarted(Map map) {
            }
            @Override
            public void onCrashStarted(Thread arg0, Throwable arg1) {
            }
            @Override
            public void onNativeCrashStarted(Error arg0, String arg1, int arg2) {
            }
        });
    }
}
