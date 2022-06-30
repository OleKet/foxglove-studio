// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { MessageEvent, Topic } from "@foxglove/studio";
import PanelSetup from "@foxglove/studio-base/stories/PanelSetup";

import ThreeDeeRender from "../index";
import { Marker, MarkerType, TransformStamped, Vector3 } from "../ros";
import { makeColor, QUAT_IDENTITY, SENSOR_FRAME_ID } from "./common";
import useDelayedFixture from "./useDelayedFixture";

export default {
  title: "panels/ThreeDeeRender",
  component: ThreeDeeRender,
  parameters: { colorScheme: "dark" },
};

export function LabelMarkers(): JSX.Element {
  const topics: Topic[] = [
    { name: "/tf", datatype: "geometry_msgs/TransformStamped" },
    { name: "/labels", datatype: "visualization_msgs/Marker" },
  ];

  const tf1: MessageEvent<TransformStamped> = {
    topic: "/tf",
    receiveTime: { sec: 10, nsec: 0 },
    message: {
      header: { seq: 0, stamp: { sec: 0, nsec: 0 }, frame_id: "map" },
      child_frame_id: "base_link",
      transform: {
        translation: { x: 1e7, y: 0, z: 0 },
        rotation: QUAT_IDENTITY,
      },
    },
    sizeInBytes: 0,
  };
  const tf2: MessageEvent<TransformStamped> = {
    topic: "/tf",
    receiveTime: { sec: 10, nsec: 0 },
    message: {
      header: { seq: 0, stamp: { sec: 0, nsec: 0 }, frame_id: "base_link" },
      child_frame_id: SENSOR_FRAME_ID,
      transform: {
        translation: { x: 0, y: 1, z: 0 },
        rotation: QUAT_IDENTITY,
      },
    },
    sizeInBytes: 0,
  };

  let id = 0;
  const makeLabel = (
    text: string,
    position: Vector3,
    colorHex: string,
    size = 1,
  ): MessageEvent<Partial<Marker>> => {
    return {
      topic: "/labels",
      receiveTime: { sec: 10, nsec: 0 },
      message: {
        header: { seq: 0, stamp: { sec: 0, nsec: 0 }, frame_id: SENSOR_FRAME_ID },
        id: id++,
        ns: "",
        action: 0,
        type: MarkerType.TEXT_VIEW_FACING,
        text,
        frame_locked: true,
        color: makeColor(colorHex, size),
        pose: { position, orientation: QUAT_IDENTITY },
        scale: { x: 0, y: 0, z: size },
      },
      sizeInBytes: 0,
    };
  };

  const label1 = makeLabel("Hello, world!", { x: -2, y: 1, z: 0 }, "#e60049", 0.2);
  const label2 = makeLabel("Hello, world!", { x: -1, y: 1, z: 0 }, "#0bb4ff", 0.3);
  const label3 = makeLabel("Hello, world!", { x: 0, y: 1, z: 0 }, "#50e991", 0.4);
  const label4 = makeLabel("Hello, world!", { x: 1, y: 1, z: 0 }, "#e6d800", 0.5);
  const label5 = makeLabel("Hello, world!", { x: -2, y: 0, z: 0 }, "#9b19f5", 0.6);
  const label6 = makeLabel("Hello, world!", { x: -1, y: 0, z: 0 }, "#ffa300", 0.7);
  const label7 = makeLabel("Hello, world!", { x: 1, y: 0, z: 0 }, "#dc0ab4", 0.8);
  const label8 = makeLabel("Hello, world!", { x: -2, y: -1, z: 0 }, "#b3d4ff", 0.9);
  const label9 = makeLabel("Hello, world!", { x: -1, y: -1, z: 0 }, "#00bfa0", 1.0);
  const label10 = makeLabel("Hello, world!", { x: 0, y: -1, z: 0 }, "#b30000", 1.1);
  const label11 = makeLabel("Hello, world!", { x: 1, y: -1, z: 0 }, "#7c1158", 1.2);

  const fixture = useDelayedFixture({
    topics,
    frame: {
      "/tf": [tf1, tf2],
      // prettier-ignore
      "/labels": [label1, label2, label3, label4, label5, label6, label7, label8, label9, label10, label11],
    },
    capabilities: [],
    activeData: {
      currentTime: { sec: 0, nsec: 0 },
    },
  });

  return (
    <PanelSetup fixture={fixture}>
      <ThreeDeeRender
        overrideConfig={{
          ...ThreeDeeRender.defaultConfig,
          followTf: "base_link",
          cameraState: {
            distance: 5.5,
            perspective: true,
            phi: 0.5,
            targetOffset: [-0.5, 0.75, 0],
            thetaOffset: -0.25,
            fovy: 0.75,
            near: 0.01,
            far: 5000,
            target: [0, 0, 0],
            targetOrientation: [0, 0, 0, 1],
          },
          layers: {
            grid: { layerId: "foxglove.Grid" },
          },
        }}
      />
    </PanelSetup>
  );
}
