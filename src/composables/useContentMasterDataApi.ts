import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from "axios";
import { parseNDJSON } from "@/utils/parse-ndjson";

import type { ContentStatus } from "@/types/generated/ContentMasterDataApi";

type ContentMasterDataEndpoint = "content-statuses";

type ContentMasterDataApi = {
  _axiosInstance: AxiosInstance;
  get: <T extends ContentStatus[]>(
    url: ContentMasterDataEndpoint,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<T>>;
};

/**
 * Content Master Data Service interface
 * @returns _axiosInstance - Original axios instance, to be used only for internal purpose
 * @returns get - Public method for get requests, TS already configured
 */
export function useContentMasterDataApi(): ContentMasterDataApi {
  const config = useRuntimeConfig();
  const axiosInstance = axios.create({
    baseURL: config.public.CONTENT_MASTER_DATA_SERVICE_BASE_URL,
    headers: {
      Authorization: `Bearer ${config.public.AUTH_TOKEN}`,
      "accept-version": "vnd.content-master-data.v1",
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
