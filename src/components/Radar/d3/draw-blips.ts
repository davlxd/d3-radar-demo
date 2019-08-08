import * as d3 from 'd3'

import forceWithinQuandrant from './force-within-quadrant'
import forcePlaceholdingCirclesTailingDad from './force-placeholding-circles-tailing-dad'
import {
  hoverInQuadrantEffect,
  hoverOutQuadrantEffect
} from './quadrant-hover-effect'

import { Blip } from '../index'

//TODO rename r, radius

interface SimulationNodeDatum {
  x: number,
  y: number,
  vx?: number,
  vy?: number,
}

export interface SimulationBlip extends Blip, SimulationNodeDatum { 
  r: number,
  quadrantIndex: number,
  shapeName: string,
}

interface CollideAvoidSimulationNodeDatum extends SimulationNodeDatum {
  radius: number,
}

interface CollideAvoidSimulationBlip extends SimulationBlip, CollideAvoidSimulationNodeDatum {
}

export interface PlaceHoldingCircle extends CollideAvoidSimulationNodeDatum { 
  dad: CollideAvoidSimulationBlip,
  nth: number,
}

const attachSimulationDataToBlips = (
  radius: number,
  blips: Blip[]
): SimulationBlip[] => {
  const blipShapes = [ { shapeName: 'rect', }, { shapeName: 'circle', } ]

  const uniqueQuadrantNames = [...Array.from(new Set(blips.map(blip => blip.quadrant)))]
  const minAndMaxOfBlipScore = blips.map(blip => blip.score)
                                   .reduce((acc, cur) => [Math.min(acc[0], cur), Math.max(acc[1], cur)], [Infinity, -Infinity])
  const scoreToRadiusScale = d3.scaleLinear().domain(minAndMaxOfBlipScore).range([radius, 50])

  return blips.map(blip => {
    const quadrantIndex = uniqueQuadrantNames.indexOf(blip.quadrant)
    const r = scoreToRadiusScale(blip.score)
    return {
      ...blip,
      r,
      quadrantIndex,
      ...blipShapes[quadrantIndex % blipShapes.length],
      x: 0,
      y: 0,
    }
  })
}

export default (
  g: d3.Selection<SVGGElement, unknown, HTMLElement, any>, 
  radius: number,
  blips: Blip[],
  hoverOnQuadrant: (quadrantIndex: number) => void,
  clickOnBlip: (quadrant: string, name: string) => void
) => {
  const color = d3.scaleOrdinal(d3.schemeCategory10)
  const simulationBlips: SimulationBlip[] = attachSimulationDataToBlips(radius, blips)

  const blipsG = g.append('g')
                  .attr('class', 'blips')

  const eachBlip = blipsG.selectAll('g.blip')
                         .data(simulationBlips)
                         .enter()
                           .append('g')
                           .attr('class', 'blip')
                           .attr('quadrant-name', d => d.quadrant)
                           .attr('quadrant-index', d => d.quadrantIndex)
                           .style('cursor', 'pointer')
                           .style('pointer-events', 'click')
                           .on('mouseover', ({ quadrantIndex }) => {
                             hoverInQuadrantEffect(g, quadrantIndex)
                             hoverOnQuadrant(quadrantIndex)
                           })
                           .on('mouseout', ({ quadrantIndex}) => {
                             hoverOutQuadrantEffect(g, quadrantIndex)
                           })
                           .on('click', ({ quadrant, name }) => {
                             clickOnBlip(quadrant, name)
                           })

  const eachBlipSymbol = eachBlip.append(d => document.createElementNS(d3.namespaces.svg, d.shapeName))
                                 .attr('class', 'blip-element blip-symbol')
                                 .style('fill', d => color(d.quadrantIndex.toString()))
                                 .attr('width', 22)
                                 .attr('height', 22)
                                 .attr('r', 12)
                                 .attr('rx', '0.4em')
                                 .attr('ry', '0.4em')

  const eachBlipText = eachBlip.append('text')
                               .attr('class', 'blip-element blip-text')
                               .text(d => d.name)

  const blipSymbolBBox = (index: number) => (eachBlipSymbol.nodes()[index] as SVGGraphicsElement).getBBox()
  const blipTextBBox = (index: number) => (eachBlipText.nodes()[index] as SVGGraphicsElement).getBBox()

  const positionSymbolAndText = (withPlaceholdingCircles: boolean) => () => {
    eachBlipSymbol.attr('x', ({ x }, i) => x - blipSymbolBBox(i).width / 2)
                  .attr('y', ({ y }, i) => y - blipSymbolBBox(i).height / 2)
                  .attr('cx', ({ x }) => x)
                  .attr('cy', ({ y }) => y)

    eachBlipText.attr('x', ({ quadrantIndex, x }, i) => (quadrantIndex === 0 || quadrantIndex === 1) ? (x + blipSymbolBBox(i).width / 2) : (x - blipTextBBox(i).width - blipSymbolBBox(i).width / 2))
                .attr('y', ({ quadrantIndex, y }, i) => (quadrantIndex === 1 || quadrantIndex === 2) ? (y + blipTextBBox(i).height / 2) : y)

    if (withPlaceholdingCircles) {
      eachPlaceholdingCircle.attr('cx', ({ x }) => x)
                            .attr('cy', ({ y }) => y)
    }
  }

  const simulation = d3.forceSimulation(simulationBlips)
                       .force('radial', d3.forceRadial(d => (d as SimulationBlip).r))
                       .force('in-quandrant', forceWithinQuandrant())
                       .on('tick', positionSymbolAndText(false))
                       .alphaDecay(0.01)


  const BLIP_COLLIDE_RADIUS_MARGIN = 10

  const collideAvoidBlips: CollideAvoidSimulationBlip[] = simulationBlips.map((blip, index) => ({
    ...blip,
    radius: Math.max(blipSymbolBBox(index).width, blipSymbolBBox(index).height)/2 + BLIP_COLLIDE_RADIUS_MARGIN,
  }))

  const placeholdingCircles: PlaceHoldingCircle[] = collideAvoidBlips.flatMap((blip, index) => {
    const placeholdingCircleAmount = blipTextBBox(index).height === 0 ? 0 : Math.floor(blipTextBBox(index).width / blipTextBBox(index).height)
    return [
      ...[...Array.from(Array(placeholdingCircleAmount).keys())].map(
        (nthForBlip: number): PlaceHoldingCircle => ({
          dad: blip,
          nth: nthForBlip,
          radius: blipTextBBox(index).height / 2,
          x: 0,
          y: 0,
        }))
    ]
  })

  // const withPlaceholdingCircles = addPlaceholdingCircleForRadialCollideForce(simulationBlips)

  const eachPlaceholdingCircle = g.select('g.blips').selectAll('g.fake-circle')
                                                    .data(placeholdingCircles)
                                                    .enter()
                                                      .append('g')
                                                      .attr('class', 'fake-circle')
                                                      .append('circle')
                                                      .style('pointer-events', 'none')
                                                      .attr('r', d => d.radius)
                                                      .attr('cx', d => d.x)
                                                      .attr('cy', d => d.x)
                                                      .attr('fill-opacity', 0)
                                                      .attr('stroke', '#000000')
                                                      .attr('stroke-opacity', 0)
                                                      .attr('dad-name', d => d.dad.name)

  const allCollideAvoidNodes: CollideAvoidSimulationNodeDatum[] = (collideAvoidBlips as CollideAvoidSimulationNodeDatum[]).concat(placeholdingCircles as CollideAvoidSimulationNodeDatum[])
  
  console.log(allCollideAvoidNodes)
  const simulation2 = d3.forceSimulation(allCollideAvoidNodes)
                        .force('collide', d3.forceCollide(d => (d as CollideAvoidSimulationNodeDatum).radius).strength(0.999))
                        // .force('position-placeholding-circles', forcePlaceholdingCirclesTailingDad())
                        .on('tick', positionSymbolAndText(true))
                        .alphaDecay(0.01)
  
  const simulation3 = d3.forceSimulation(placeholdingCircles)
                        .force('position-placeholding-circles', forcePlaceholdingCirclesTailingDad())
                        .on('tick', positionSymbolAndText(true))
                        .alphaDecay(0.01)

  return { blipsG, eachBlip, eachPlaceholdingCircle, simulation, simulation2 }
}
