import axios from "axios";
import { describe, expect, test, vi } from "vitest";
import { useExperienceMasterDataApi } from "../useExperienceMasterDataApi";
import { mockUseRuntimeConfig } from "@/__mocks__/useRuntimeConfig";

vi.stubGlobal("useRuntimeConfig", mockUseRuntimeConfig);

vi.mock("@/utils/parse-ndjson", () => ({
  parseNDJSON: vi.fn(() => "parsed-data"),
}));

vi.mock("axios", async () => {
  const realAxios = await vi.importActual<typeof import("axios")>("axios");
  return {
    default: {
      create: vi.fn(() => ({
        ...realAxios.default.create(),
        get: vi.fn(),
      })),
    },
  };
});

describe("useExperienceMasterDataApi", () => {
  test("it should return the correct axios instance", () => {
    const { get } = useExperienceMasterDataApi();

    expect(get).toBeTruthy();
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: "test-url",
      headers: {
        Authorization: "Bearer test-token",
        "accept-version": "vnd.experiences-master-data.v1",
      },
      params: {
        language_code: "en",
      },
    });
  });

  describe("interceptors", () => {
    test("it should parse the response data", () => {
      const { _axiosInstance } = useExperienceMasterDataApi();
      const mockResponse = {
        status: 200,
        data: "data",
      };

      const response =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (_axiosInstance.interceptors.response as any).handlers[0].fulfilled(
          mockResponse
        );

      expect(response.data).toBe("parsed-data");
    });
  });
});
