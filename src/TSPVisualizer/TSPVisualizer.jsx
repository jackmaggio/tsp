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
      currentId: "",
      nodes: {},
    };
    //this.state.nodes = {};
    this.edges = {};
    this.routes = {};
    this.ids = [];
    this.totalNodes = 0;
  }

  generateRoutes(nodes) {
    var result = [];
    if (nodes.length === 1) {
      return [[nodes[0]]];
    }
    var size = nodes.length;
    for (let i = 0; i < size; i++) {
      var removed = nodes.splice(0, 1);

      var perms = this.generateRoutes(nodes);

      for (let j = 0; j < perms.length; j++) {
        perms[j].push(removed[0]);
        result.push(perms[j]);
        if (perms[j].length === this.totalNodes) {
          this.traverseRoute(perms[j]);
        }
      }

      nodes.push(removed[0]);
    }
    return result;
  }

  traverseRoute(route) {
    var usedEdges = [];
    route.push(route[0]);
    for (let i = 0; i < route.length - 1; i++) {
      var source = route[i];
      var dest = route[i + 1];

      var edgeId = "";
      if (source < dest) {
        edgeId = source + dest;
      } else {
        edgeId = dest + source;
      }
      usedEdges.push(edgeId);

      // this.changeNodeColor(source, "green");

      // let temp = this.state.nodes;
      // console.log(temp, this.state.nodes);
      // temp[source][2] = "green";
      // this.setState({ nodes: temp });
      console.log(
        document.getElementById("nodeA").getElementsByTagName("circle")[0]
      );
      document
        .getElementById("nodeA")
        .getElementsByTagName("circle")[0]
        .setAttribute("fill", "green");

      //this.state.nodes[source][2] = "green";
      //console.log(document.getElementById("nodeA"));
      this.edges[edgeId][5] = "green";

      //await this.sleep(5);

      //this.changeNodeColor(dest, "green");
      //await this.sleep(5);
    }
    // for (let i = 0; i < route.length; i++) {
    //   this.state.nodes[route[i]][2] = "gold";
    // }
  }
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
      pt.x = this.state.nodes[currentId][0];
      pt.y = this.state.nodes[currentId][1];
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
      this.edges[id] = [x1, y1, x2, y2, weight, "red"];
      currentId = String.fromCharCode(currentId.charCodeAt(0) + 1);
    }
    //add new node to the map of nodes: key= id, value= [x coordinate, y coordinate, fill color]
    var divId = "node" + this.state.nextId;
    let temp = this.state.nodes;
    temp[this.state.nextId] = [ev.clientX - 150, ev.clientY, "gold", divId];
    this.setState({ nodes: temp });

    // this.state.nodes[this.state.nextId] = [
    //   ev.clientX - 150,
    //   ev.clientY,
    //   "gold",
    //   divId,
    // ];

    this.ids.push(this.state.nextId);
    //update the id of the nextnode
    this.setState({
      nextId: String.fromCharCode(this.state.nextId.charCodeAt(0) + 1),
    });
    this.totalNodes += 1;
  };

  render() {
    const nodes = this.state.nodes;
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
                stroke={this.edges[key][5]}
                strokeWidth="2"
                position="absolute"
              />
              <text
                x={(this.edges[key][0] + this.edges[key][2]) / 2}
                y={(this.edges[key][1] + this.edges[key][3]) / 2}
                dominantBaseline="auto"
                fontFamily="Arial"
                fontSize="20"
                fill="black"
              >
                {this.edges[key][4]}
              </text>
            </svg>
          ))}
          {Object.keys(nodes).map((key) => (
            <svg id={nodes[key][3]} className="node" overflow="visible">
              <circle
                id={key}
                cx={nodes[key][0]}
                cy={nodes[key][1]}
                r="25"
                fill={nodes[key][2]}
                stroke="black"
                strokeWidth="5"
              ></circle>
              <text
                x={this.state.nodes[key][0]}
                y={this.state.nodes[key][1]}
                dominantBaseline="middle"
                fontFamily="Arial"
                textAnchor="middle"
                fontSize="25"
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
