import { NativeModules } from 'react-native';

// const AnalysisApi = NativeModules.AnalysisModule;

class Analysis {
    static setParams(params: string) {
        let param = {
            customMessage: params
        };
        // return AnalysisApi.setParams(param);
    };
}

export default Analysis;