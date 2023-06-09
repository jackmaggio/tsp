import "./TSPVisualizer.css";
import Node from "./Node/node";
import React, { Component } from "react";

export default class TSPVisualizer extends Component {
  //Creates a new TSPVisualizer
  //Contains id of next node, list of nodes, list of edges
  constructor(props) {
    super(props);
    this.state = {
      nextId: "A",
    };
    this.nodes = {};
    this.edges = {};
    this.routes = {};
    this.ids = [];
  }

  generateRoutes(nums) {
    alert();
    var result = [];
    if (nums.length === 1) {
      return [[nums[0]]];
    }
    var size = nums.length;
    for (let i = 0; i < size; i++) {
      var removed = nums.splice(0, 1);

      var perms = this.generateRoutes(nums);

      for (let j = 0; j < perms.length; j++) {
        perms[j].push(removed[0]);
        result.push(perms[j]);
      }

      nums.push(removed[0]);
    }
    return result;
  }

  traverseRoute() {}
  //Allows user to drag nodes onto the background
  dragNewNode = (ev) => {
    ev.preventDefault();
  };

  //Allows user to drop nodes onto the background
  //Adds new node to list of nodes and all edges
  dropNewNode = (ev) => {
    var currentId = "A";
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    var pt = s.createSVGPoint();
    var svgGlobal;
    //Create edges connecting each existing node
    while (currentId !== this.state.nextId) {
      // current edge id, ie: AB, EF
      var id = currentId + this.state.nextId;

      // x/y coordinates of existing node
      pt.x = this.nodes[currentId][0];
      pt.y = this.nodes[currentId][1];
      //Transform coordinates to SVG coordinates
      svgGlobal = pt.matrixTransform(s.getScreenCTM().inverse());
      var x1 = svgGlobal.x;
      var y1 = svgGlobal.y;

      // Mouse coordinates
      pt.x = ev.clientX - 150;
      pt.y = ev.clientY;
      //Convert mouse coordinates to SVG coordinates
      svgGlobal = pt.matrixTransform(s.getScreenCTM().inverse());
      var x2 = svgGlobal.x;
      var y2 = svgGlobal.y;

      //generate random weight
      var weight = Math.floor(Math.random() * 100 + 1);
      //Store edge coordinates in edges map
      this.edges[id] = [x1, y1, x2, y2, weight];
      currentId = String.fromCharCode(currentId.charCodeAt(0) + 1);
    }
    //add new node to the map of nodes: key= id, value= [x coordinate, y coordinate, fill color]
    this.nodes[this.state.nextId] = [ev.clientX - 150, ev.clientY, "gold"];
    this.ids.push(this.state.nextId);
    //update the id of the nextnode
    this.setState({
      nextId: String.fromCharCode(this.state.nextId.charCodeAt(0) + 1),
    });
  };

  render() {
    return (
      <div className="tsp" droppable="true">
        <div className="side-pane">
          <Node></Node>
          <button onClick={(e) => this.generateRoutes(this.ids)}>Start</button>
        </div>
        <svg
          id="back"
          className="back"
          droppable="true"
          onDragOver={(e) => this.dragNewNode(e)}
          onDrop={(e) => this.dropNewNode(e)}
        >
          {Object.keys(this.edges).map((key) => (
            <svg className="edge" overflow="visible">
              <line
                x1={this.edges[key][0]}
                y1={this.edges[key][1]}
                x2={this.edges[key][2]}
                y2={this.edges[key][3]}
                stroke="red"
                strokeWidth="2"
                position="absolute"
              />
              <text
                x={(this.edges[key][0] + this.edges[key][2]) / 2}
                y={(this.edges[key][1] + this.edges[key][3]) / 2}
                dominantBaseline="auto"
                fontFamily="Arial"
                font-size="20"
                fill="black"
              >
                {this.edges[key][4]}
              </text>
            </svg>
          ))}
          {Object.keys(this.nodes).map((key) => (
            <svg className="node" overflow="visible">
              <circle
                id={key}
                cx={this.nodes[key][0]}
                cy={this.nodes[key][1]}
                r="25"
                fill={this.nodes[key][2]}
                stroke="black"
                stroke-width="5"
              ></circle>
              <text
                x={this.nodes[key][0]}
                y={this.nodes[key][1]}
                dominantBaseline="middle"
                fontFamily="Arial"
                textAnchor="middle"
                font-size="25"
                fill="black"
              >
                {key}
              </text>
            </svg>
          ))}
        </svg>
      </div>
    );
  }
}
