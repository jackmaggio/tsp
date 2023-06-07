import React, { Component } from "react";
import "./node.css";
export default class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      id: "A",
    };
  }

  render() {
    return <div className="node" draggable="true"></div>;
  }
  // <div
  //   className="node"
  //   droppable="false"
  //   overflow="visible"
  //   style={{
  //     left: this.nodes[key][0],
  //     top: this.nodes[key][1],
  //     position: "absolute",
  //   }}
  // >
  //   {key}
  // </div>
}
