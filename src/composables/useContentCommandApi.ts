import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import type {
  ExperienceTranslation,
  ExperienceCommercialContent,
  Flow,
  ExperienceMedia,
} from "@/types/generated/ContentCommandApi";
import type { AvailableLanguage } from "@/types/Language";
import { parseNDJSON } from "@/utils/parse-ndjson";

interface ContentCommandConfig extends AxiosRequestConfig {
  params: {
    language_code: AvailableLanguage;
  };
}

type ContentCommandApi = {
  _axiosInstance: AxiosInstance;
  getTranslation: <T extends ExperienceTranslation>(
    url: `experience-translations/${string}`,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<T>>;

  getTranslations: <T extends ExperienceTranslation[]>(
    url: "experience-translations",
    config?: ContentCommandConfig
  ) => Promise<AxiosResponse<T>>;

  putTranslation: <T extends ExperienceTranslation>(
    url: `experience-translations/${string}`,
    data: T
  ) => Promise<AxiosResponse>;

  postTranslation: <T extends ExperienceTranslation>(
    url: "experience-translations",
    data: T
  ) => Promise<AxiosResponse>;

  putExperienceMedia: <T extends ExperienceMedia>(
    url: `experience-media/${string}`,
    data: T
  ) => Promise<AxiosResponse>;

  postImage: <T extends FormData>(
    url: "images",
    data: T,
    config: { headers: { "Content-Type": "multipart/form-data" } }
  ) => Promise<AxiosResponse>;

  putImage: <T extends FormData>(
    url: `images/${string}`,
    data: T,
    config: { headers: { "Content-Type": "multipart/form-data" } }
  ) => Promise<AxiosResponse>;

  deleteImage: (url: `images/${string}`) => Promise<AxiosResponse>;

  getExperienceCommercialContent: <T extends ExperienceCommercialContent[]>(
    url: "experience-commercial-content",
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<T>>;

  getFlows: <T extends Flow[]>(
    url: "flows",
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<T>>;
};

export function useContentCommandApi(): ContentCommandApi {
  const config = useRuntimeConfig();
  const axiosInstance = axios.create({
    baseURL: config.public.CONTENT_COMMAND_SERVICE_BASE_URL,
    headers: {
      Authorization: `Bearer ${config.public.AUTH_TOKEN}`,
      "accept-version": "vnd.content-command-service.v1",
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
    getTranslation: axiosInstance.get,
    getTranslations: axiosInstance.get,
    putTranslation: axiosInstance.put,
    postTranslation: axiosInstance.post,
    putExperienceMedia: axiosInstance.put,
    postImage: axiosInstance.post,
    putImage: axiosInstance.put,
    deleteImage: axiosInstance.delete,
    getExperienceCommercialContent: axiosInstance.get,
    getFlows: axiosInstance.get,
    _axiosInstance: axiosInstance,
  };
}
