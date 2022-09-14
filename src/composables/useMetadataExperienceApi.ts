import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { parseNDJSON } from "@/utils/parse-ndjson";
import {
  ExperienceAdditionalService,
  ExperienceHighlights,
  ExperienceImportantInformation,
  ExperienceIncluded,
  ExperienceNonIncluded,
} from "@/types/generated/MetadataExperiencesApi";

type MetadataExperienceApi = {
  _axiosInstance: AxiosInstance;
  get: <
    T extends
      | ExperienceHighlights[]
      | ExperienceImportantInformation[]
      | ExperienceIncluded[]
      | ExperienceNonIncluded[]
      | ExperienceAdditionalService[]
  >(
    url: string,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<T>>;
  put: <
    D extends
      | ExperienceHighlights
      | ExperienceImportantInformation
      | ExperienceIncluded
      | ExperienceNonIncluded
      | ExperienceAdditionalService
  >(
    url: string,
    data: D
  ) => Promise<AxiosResponse<D>>;
  post: <
    D extends
      | ExperienceHighlights
      | ExperienceImportantInformation
      | ExperienceIncluded
      | ExperienceNonIncluded
  >(
    url: string,
    data: D
  ) => Promise<AxiosResponse<D>>;
};

/**
 * Metadata Experience Service interface
 * @returns _axiosInstance - Original axios instance, to be used only for internal purpose
 * @returns get - Public method for get requests, TS already configured
 */
export function useMetadataExperienceApi(): MetadataExperienceApi {
  const config = useRuntimeConfig();

  const axiosInstance = axios.create({
    baseURL: config.public.METADATA_EXPERIENCE_SERVICE_BASE_URL,
    headers: {
      Authorization: `Bearer ${config.public.AUTH_TOKEN}`,
      "accept-version": "vnd.metadata-experiences-service.v1",
    },
  });

  axiosInstance.interceptors.response.use((res) => {
    const parsedData = parseNDJSON(res.data);
    return { ...res, data: parsedData };
  });
  return {
    _axiosInstance: axiosInstance,
    get: axiosInstance.get,
    put: axiosInstance.put,
    post: axiosInstance.post,
  };
}
