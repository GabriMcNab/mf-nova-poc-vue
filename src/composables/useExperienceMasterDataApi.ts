import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from "axios";
import { parseNDJSON } from "@/utils/parse-ndjson";

import type {
  AdditionalService,
  Highlights,
  ImportantInformation,
  Included,
} from "@/types/generated/ExperienceMasterDataApi";

type ExperienceMasterDataEndpoint =
  | "highlights"
  | "included"
  | "important-information"
  | "additional-services";

type ExperienceMasterDataApi = {
  _axiosInstance: AxiosInstance;
  get: <
    T extends
      | Highlights[]
      | Included[]
      | ImportantInformation[]
      | AdditionalService[]
  >(
    url: ExperienceMasterDataEndpoint,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<T>>;
};

/**
 * Experience Master Data Service interface
 * @returns _axiosInstance - Original axios instance, to be used only for internal purpose
 * @returns get - Public method for get requests, TS already configured
 */
export function useExperienceMasterDataApi(): ExperienceMasterDataApi {
  const config = useRuntimeConfig();
  const axiosInstance = axios.create({
    baseURL: config.public.EXPERIENCE_MASTER_DATA_SERVICE_BASE_URL,
    headers: {
      Authorization: `Bearer ${config.public.AUTH_TOKEN}`,
      "accept-version": "vnd.experiences-master-data.v1",
    },
    params: {
      language_code: "en",
    },
  });

  axiosInstance.interceptors.response.use((res) => {
    const parsedData = parseNDJSON(res.data);
    return { ...res, data: parsedData };
  });

  return {
    _axiosInstance: axiosInstance,
    get: axiosInstance.get,
  };
}
