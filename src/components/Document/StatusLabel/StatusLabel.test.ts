import { config, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, test, vi } from "vitest";
import StatusLabel from "./StatusLabel.vue";

config.global.mocks = {
  $t: (text: string) => text,
};

const masterDataStoreMock = {
  getStatusCodeById: () => "PUBLISHED",
  getFlowCodeById: () => "CURATION",
};

vi.mock("@/stores/master-data", () => ({
  useMasterData: () => masterDataStoreMock,
}));

const props = {
  statusId: "test-status",
  flowId: "test-flow",
};

describe("StatusLabel", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("it renders the passed status flow and code", () => {
    const wrapper = mount(StatusLabel, { props });

    expect(wrapper.attributes().theme).toBe("green");
    expect(wrapper.text()).toBe("status.flow.curation - status.code.published");
  });

  describe("if no flowId or statusId is passed", () => {
    test("it should render the 'draft' label", () => {
      const wrapper = mount(StatusLabel);

      expect(wrapper.attributes().theme).toBe("light-grey");
      expect(wrapper.text()).toBe("status.code.draft");
    });
  });
});
