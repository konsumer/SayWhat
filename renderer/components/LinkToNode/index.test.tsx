import React from "react";
import { render, fireEvent } from "@testing-library/react";

import LinkToNode from ".";

const mockAddNode = jest.fn();
const mockSelectNode = jest.fn();
jest.mock("../../hooks/useApplication", () => {
  return () => ({
    addNode: mockAddNode,
    selectNode: mockSelectNode
  });
});

jest.mock("../../hooks/useNodes", () => {
  return () => ({
    byId: {
      nodeId: {
        id: "nodeId",
        name: "Next"
      }
    }
  });
});

const mockShowNextNodePicker = jest.fn();

jest.mock("../../hooks/useNodePicker", () => {
  return () => ({
    showNextNodePicker: mockShowNextNodePicker
  });
});

describe("LinkToNode", () => {
  it("can render the end of a conversation", () => {
    expect.hasAssertions();

    const from = {
      id: "responseId",
      goToNodeName: "END"
    };

    const { container } = render(<LinkToNode from={from} />);
    expect(container.innerHTML).toContain("end conversation");
  });

  it("can pick or create the next node", () => {
    expect.hasAssertions();

    const from = {
      id: "responseId",
      goToNodeName: "unkown",
      goToNodeId: "unknown"
    };

    const { queryByTestId } = render(<LinkToNode from={from} />);
    expect(queryByTestId("not-found").textContent).toContain("doesn't exist");

    fireEvent.click(queryByTestId("create-button"));
    expect(mockAddNode).toHaveBeenCalled();

    fireEvent.click(queryByTestId("pick-button"));
    expect(mockAddNode).toHaveBeenCalled();
  });

  it("can render a link to the next node", () => {
    expect.hasAssertions();

    const from = {
      id: "responseId",
      goToNodeName: "Next",
      goToNodeId: "nodeId"
    };

    const { queryByTestId } = render(<LinkToNode from={from} />);

    const link = queryByTestId("node-link") as HTMLAnchorElement;
    expect(link.textContent).toContain("Next");
    fireEvent.click(link);
    expect(mockSelectNode).toHaveBeenCalled();
  });
});
