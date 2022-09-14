import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { parseNDJSON } from "@/utils/parse-ndjson";
import { RawElement } from "@/types/generated/ExperienceRawServiceApi";

type ExperienceRawApi = {
  _axiosInstance: AxiosInstance;
  getRawExperience: <T extends RawElement>(
    url: `experience-raw/${string}`,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<T>>;

  getRawExperiences: <T extends RawElement[]>(
    url: `experience-raw`,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<T>>;

  putRawExperience: <T extends RawElement>(
    url: `experience-raw/${string}`,
    data: T
  ) => Promise<AxiosResponse>;

  postRawExperience: <T extends RawElement>(
    url: `experience-raw`,
    data: T
  ) => Promise<AxiosResponse>;
};

/**
 * Experience Raw Service interface
 * @returns _axiosInstance - Original axios instance, to be used only for internal purpose
 * @returns getRawExperience - Public method for get requests, TS already configured
 * @returns getRawExperiences - Public method for get requests, TS already configured (return an array)
 * @returns putRawExperience - Public method for put requests, TS already configured
 * @returns postRawExperience - Public method for post requests, TS already configured
 */
export function useExperienceRawApi(): ExperienceRawApi {
  const config = useRuntimeConfig();

  const axiosInstance = axios.create({
    baseURL: config.public.EXPERIENCE_RAW_SERVICE_BASE_URL,
    headers: {
      Authorization: `Bearer ${config.public.AUTH_TOKEN}`,
      "accept-version": "vnd.experience-raw-service.v1",
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
    getRawExperience: axiosInstance.get,
    getRawExperiences: axiosInstance.get,
    putRawExperience: axiosInstance.put,
    postRawExperience: axiosInstance.post,
  };
}
