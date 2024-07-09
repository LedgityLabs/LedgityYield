declare module '@iexec/dataprotector' {
  export class IExecDataProtector {
    constructor(provider: any);
    core: {
      grantAccess: (params: any) => Promise<any>;
      getProtectedData: (params: any) => Promise<any>;
      getGrantedAccess: (params: any) => Promise<any>;
    };
  }

  export interface ProtectedData {
    address: string;
    // Add other properties as needed
  }
}