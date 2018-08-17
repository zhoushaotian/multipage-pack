import * as d3 from 'd3';
import './index.less';

let width = 900;
let heigt = 800;
let nodesData = [
    {
        name: 'c'
    },
    {
        name: 'js'
    },
    {
        name: 'java'
    },
    {
        name: 'c#'
    },
    {
        name: 'kolin'
    },
    {
        name: 'swift'
    },
    {
        name: 'julia'
    },
    {
        name: 'c++'
    }
];

const linksData = [ { source : 0 , target: 1 } , { source : 0 , target: 2 } ,
    { source : 0 , target: 3 } , { source : 1 , target: 4 } ,
    { source : 1 , target: 5 } , { source : 1 , target: 6 } ];
const color = d3.scaleOrdinal(d3.schemeCategory10);

let svg = d3.select('#force')
            .append('svg')
            .attr('width', width)
            .attr('height', heigt);

let simulation = d3.forceSimulation(nodesData)
                    .force("link",d3.forceLink(linksData).distance(300))
                    .force("charge",d3.forceManyBody())
                    .force("center",d3.forceCenter(width/2,heigt/2));

let links = svg.append('g')
                .attr('class','links')
                .selectAll('line')
                .data(linksData)
                .enter()
                .append('line')
                .attr('stroke-width', 2);

let nodes = svg.append('g')
                .attr('class', 'nodes')
                .selectAll('circle')
                .data(nodesData)
                .enter()
                .append('circle')
                .attr('r', 5)
                .attr('fill', function(d, i) {
                    return color(i);
                })
                .call(d3.drag().on('start', dragStart).on('drag', drag).on('end', dragEnd))

let text = svg.selectAll('text')
                .data(nodesData)
                .enter()
                .append('text')
                .style('fill', function(d, i) {
                    return color(i)
                })
                .text(function(d) {
                    return d.name
                })

simulation.nodes(nodesData)
            .on('tick', ticked)

function dragStart(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();  //restart是重新恢复模拟
    d.fx = d.x;    //d.x是当前位置，d.fx是固定位置
    d.fy = d.y;
    }
    
function drag(d) {
d.fx = d3.event.x;
d.fy = d3.event.y;
}
    
function dragEnd(d) {
if (!d3.event.active) simulation.alphaTarget(0);
d.fx = null;       //解除dragged中固定的坐标
d.fy = null;
}
function ticked(){
    links
      .attr("x1",function(d){return d.source.x;})
      .attr("y1",function(d){return d.source.y;})
      .attr("x2",function(d){return d.target.x;})
      .attr("y2",function(d){return d.target.y;});

    nodes
      .attr("cx",function(d){return d.x;})
      .attr("cy",function(d){return d.y;});

    text.attr('x', function(d) {
        return d.x;
    }).attr('y', function(d) {
        return d.y
    })
}
            
