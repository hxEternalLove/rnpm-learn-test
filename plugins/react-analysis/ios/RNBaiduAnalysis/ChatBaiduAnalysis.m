//
//  ChatBaiduAnalysis.m
//  RNBaiduAnalysis
//
//  Created by  辉 庄 on 2017/7/14.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ChatBaiduAnalysis.h"
#import "CrabCrashReport.h"

@implementation ChatBaiduAnalysis

NSString *message;
+ (void) setParam:(NSString *)param {
    if (message != param) {
        message = param;
    }
}

+ (void) sendCustomMessage {
    if(message) {
        [[CrabCrashReport sharedInstance] addCrashAttachLog:message forKey:@"cusstomMessage"];
    }
}

@end
