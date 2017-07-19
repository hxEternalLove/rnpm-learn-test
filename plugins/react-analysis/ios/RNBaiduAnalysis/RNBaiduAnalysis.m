#import "RNBaiduAnalysis.h"


@implementation RNBaiduAnalysis

RCT_EXPORT_MODULE(AnalysisModule);

RCT_EXPORT_METHOD(setParams:(NSDictionary *) params
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    NSString* customMessage = [params objectForKey: @"customMessage"];
    [ChatBaiduAnalysis setParam:customMessage];
}

@end
