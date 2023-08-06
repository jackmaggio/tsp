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
      nodes: {},
      edges: {},
    };
    this.routes = {};
    this.ids = [];
    this.totalNodes = 0;
    this.delay = -4000;
    this.delta = 4000;
    this.usedEdges = [];
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
      console.log(perms);
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

  traverseRoute(r) {
    this.delay += this.delta;
    console.log(this.delay);
    setTimeout(
      function (r) {
        var route = r;
        route.push(route[0]);
        for (let i = 0; i < route.length - 1; i++) {
          this.delay += this.delta;
          var source = route[i];
          var dest = route[i + 1];

          var edgeId = "";
          if (source < dest) {
            edgeId = source + dest;
          } else {
            edgeId = dest + source;
          }

          var currentNode = "node" + source;
          var currentEdge = "edge" + edgeId;
          document
            .getElementById(currentNode)
            .getElementsByTagName("circle")[0]
            .getElementsByTagName("animate")[0]
            .beginElement();

          document
            .getElementById(currentEdge)
            .getElementsByTagName("line")[0]
            .getElementsByTagName("animate")[0]
            .beginElement();
        }
      },
      this.delay,
      r
    );
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
      var edgeId = "edge" + id;

      //Store edge coordinates in edges map
      let updatedEdges = this.state.edges;
      updatedEdges[id] = {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        weight: weight,
        color: "red",
        id: edgeId,
      };
      this.setState({ edges: updatedEdges });

      currentId = String.fromCharCode(currentId.charCodeAt(0) + 1);
    }
    //add new node to the map of nodes: key= id, value= [x coordinate, y coordinate, fill color]
    var divId = "node" + this.state.nextId;
    let updatedNodes = this.state.nodes;
    updatedNodes[this.state.nextId] = [
      ev.clientX - 150,
      ev.clientY,
      "gold",
      divId,
    ];
    this.setState({ nodes: updatedNodes });

    this.ids.push(this.state.nextId);
    //update the id of the nextnode
    this.setState({
      nextId: String.fromCharCode(this.state.nextId.charCodeAt(0) + 1),
    });
    this.totalNodes += 1;
  };

  render() {
    return (
      <div className="tsp" droppable="true">
        <div className="side-pane">
          <Node />
          <div className="buttons">
            <button
              className="startButton"
              onClick={(e) => this.generateRoutes(this.ids)}
            >
              Start
            </button>
            <button className="stopButton">Stop</button>
          </div>
        </div>
        <svg
          id="back"
          className="back"
          droppable="true"
          onDragOver={(e) => this.dragNewNode(e)}
          onDrop={(e) => this.dropNewNode(e)}
        >
          {Object.keys(this.state.edges).map((key) => (
            <svg
              id={this.state.edges[key]["id"]}
              className="edge"
              overflow="visible"
            >
              <line
                x1={this.state.edges[key]["x1"]}
                y1={this.state.edges[key]["y1"]}
                x2={this.state.edges[key]["x2"]}
                y2={this.state.edges[key]["y2"]}
                stroke={this.state.edges[key]["color"]}
                strokeWidth="2"
                position="absolute"
              >
                <animate
                  attributeName="stroke"
                  values="green;"
                  dur="3s"
                  begin="indefinite"
                />
              </line>
              <text
                x={
                  (this.state.edges[key]["x1"] + this.state.edges[key]["x2"]) /
                  2
                }
                y={
                  (this.state.edges[key]["y1"] + this.state.edges[key]["y2"]) /
                  2
                }
                dominantBaseline="auto"
                fontFamily="Arial"
                fontSize="20"
                fill="black"
              >
                {this.state.edges[key]["weight"]}
              </text>
            </svg>
          ))}
          {Object.keys(this.state.nodes).map((key) => (
            <svg
              id={this.state.nodes[key][3]}
              className="node"
              overflow="visible"
            >
              <circle
                id={key}
                className={key}
                cx={this.state.nodes[key][0]}
                cy={this.state.nodes[key][1]}
                r="25"
                fill={this.state.nodes[key][2]}
                stroke="black"
                strokeWidth="5"
              >
                <animate
                  attributeName="fill"
                  values="green;"
                  dur="3s"
                  begin="indefinite"
                />
              </circle>

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
