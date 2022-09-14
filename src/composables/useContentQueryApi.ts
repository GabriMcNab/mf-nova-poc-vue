import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import config from "@/config/config.dev";
import { parseNDJSON } from "@/utils/parse-ndjson";
import type { ExperienceContent, Raw } from "@/types/generated/ContentQueryApi";

interface ExperienceContentConfig extends AxiosRequestConfig {
  params: {
    [key: string]: string;
    language_code: string;
  };
}

type ContentQueryApi = {
  _axiosInstance: AxiosInstance;
  getAllRawContents: <T extends Raw[]>(
    url: "experience-raw-content",
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<T>>;
  getExperienceContent: <T extends ExperienceContent>(
    url: `experience-content/${string}`,
    config: ExperienceContentConfig
  ) => Promise<AxiosResponse<T>>;
  getAllExperienceContents: <T extends ExperienceContent[]>(
    url: "experience-content",
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<T>>;
};

/**
 * Content Query Service interface
 * @returns _axiosInstance - Original axios instance, to be used only for internal purpose
 * @returns get - Public method for get requests, TS already configured
 */
export function useContentQueryApi(): ContentQueryApi {
  const axiosInstance = axios.create({
    baseURL: config.API.CONTENT_QUERY_SERVICE_BASE_URL,
    headers: {
      Authorization: `Bearer ${config.API.AUTH_TOKEN}`,
      "accept-version": "vnd.content-query-service.v1",
    },
  });

  axiosInstance.interceptors.response.use((res) => {
    if (res.headers["content-type"] === "application/x-ndjson") {
      const parsedData = parseNDJSON(res.data);
      return { ...res, data: parsedData };
    } else {
      return res;
    }
  });

  return {
    _axiosInstance: axiosInstance,
    getAllRawContents: axiosInstance.get,
    getExperienceContent: axiosInstance.get,
    getAllExperienceContents: axiosInstance.get,
  };
}
