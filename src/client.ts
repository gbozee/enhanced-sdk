import * as api from "./utils/api";
import * as auth from "./utils/auth";

type Options = {
  baseUrl: string;
};
type AppConfig = {
  app_key: string;
  key_length?: number;
  iterations?: number;
  functions: string[];
};
type JSONResponse = {
  status: boolean;
  data: any;
};

type Credential = {
  api_key: string;
  api_secret: string;
  owner: string;
  email: string;
};
export class EnhancedSavingsClient {
  baseUrl: string;
  app_config: AppConfig;
  token: string;
  constructor(options: Options) {
    this.baseUrl = options.baseUrl;
  }
  private async getAppConfig() {
    const result: JSONResponse = await api.getFetcher(
      `${this.baseUrl}/ai/auth/app-config`
    );
    this.app_config = result.data as AppConfig;
  }
  async updateAuthToken(
    payload: Credential & { password: string },
    recreate = false
  ) {
    if (!this.app_config || recreate) {
      await this.getAppConfig();
    }
    this.token = this.encryptPayload(payload);
  }
  encryptPayload({
    password,
    ...payload
  }: Credential & {
    password: string;
  }) {
    const { app_key, key_length = 256, iterations = 10000 } = this.app_config;
    return auth.encode(payload, password, {
      app_secret: app_key,
      key_length,
      iterations,
    });
  }
  private async makeAuthenticatedCall<T>(
    action: string,
    payload: any
  ): Promise<T> {
    if (!this.token) {
      throw new Error("No token found. Please call updateAuthToken first");
    }
    const response: Response = await api.postFetcher(
      `${this.baseUrl}/ai/auth/make-authenticated-call`,
      {
        action,
        params: payload,
      },
      {
        raw: true,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
    return await api.validateResponse(response);
  }
  async exampleCall() {
    return await this.makeAuthenticatedCall<{
      hello: string;
    }>("get_account", {});
  }
  async sampleWorker(worker: Worker) {
    return new Promise((resolve, reject) => {
      worker.postMessage({ hello: "world" });
      worker.onmessage = (event) => {
        resolve(event.data);
      };
    });
  }
}
