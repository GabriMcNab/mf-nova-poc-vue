import { vi, describe, test, expect, afterEach } from "vitest";
import { mount, config } from "@vue/test-utils";
import DashboardTableItem, { Props } from "./TableItem.vue";

const mockRouter = {
  push: vi.fn(),
};

vi.stubGlobal("useRouter", () => mockRouter);

config.global.mocks = {
  $t: (s: string) => s,
};

config.global.stubs = {
  DocumentStatusLabel: {
    template: "<span></span>",
  },
};

const selectors = {
  expandedRow: "[data-testid='expanded-row']",
  expandedRowItem: "[data-testid='expanded-row-item']",
  editBtn: "[data-testid='nova-button-icon']",
};

const tableItems = [
  {
    id: "test-id-1",
    title: "test-title-1",
    creation_date: "2022-01-01",
    updated_date: "2022-02-01",
    statuses: [],
  },
  {
    id: "test-id-2",
    title: "test-title-2",
    creation_date: "2022-01-01",
    statuses: [],
  },
];

const props: Props = {
  item: tableItems[0],
  expandedRowItems: tableItems,
  handleRowExpand: vi.fn(),
};

describe("DashboardTableItem", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("it should render correctly", () => {
    const wrapper = mount(DashboardTableItem, { props });

    expect(wrapper.html()).toContain(props.item.id);
    expect(wrapper.html()).toContain(props.item.title);
    expect(wrapper.find(selectors.expandedRow).exists()).toBe(false);
  });

  describe("when the user clicks on the row", () => {
    test("it should trigger the 'handleRowExpand' callback", async () => {
      const wrapper = mount(DashboardTableItem, { props });

      await wrapper.trigger("click");

      expect(props.handleRowExpand).toHaveBeenCalled();
    });

    test("it should expand the row", async () => {
      const wrapper = mount(DashboardTableItem, { props });

      await wrapper.trigger("click");
      expect(wrapper.find(selectors.expandedRow).exists()).toBe(true);
      expect(wrapper.find(selectors.expandedRow).isVisible()).toBe(true);
      expect(wrapper.findAll(selectors.expandedRowItem).length).toBe(2);

      await wrapper.trigger("click");
      expect(wrapper.find(selectors.expandedRow).exists()).toBe(false);
    });
  });

  describe("when expandedRowItems.length is 0", () => {
    test("it shouldn't expand the row", async () => {
      const wrapper = mount(DashboardTableItem, {
        props: { ...props, expandedRowItems: [] },
      });

      await wrapper.trigger("click");
      expect(wrapper.find(selectors.expandedRow).exists()).toBe(false);
    });
  });

  describe("when the user clicks on the edit button", () => {
    test("it should emit an event", async () => {
      const wrapper = mount(DashboardTableItem, { props });

      await wrapper.find(selectors.editBtn).trigger("click");
      const events = wrapper.emitted<Event[]>()["click:edit"];

      expect(events).toBeTruthy();
      expect(events.length).toBe(1);
    });
  });
});
