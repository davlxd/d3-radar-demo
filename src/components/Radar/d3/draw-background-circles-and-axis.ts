import * as d3 from 'd3'
import {
  hoverInQuadrantEffect,
  hoverOutQuadrantEffect,
} from './quadrant-hover-effect'

export default (
  g: d3.Selection<SVGGElement, unknown, HTMLElement, any>, 
  width: number,
  height: number, 
  radius: number, 
  quadrantNames: string[],
  hoverOnQuadrant: (quadrantIndex: number) => void
): void => {
  const quadrantCount = quadrantNames.length

  const arcs = d3.pie()(new Array(quadrantCount).fill(1))

  const arcConfig = (
    annulusIndex: number, 
    focus: boolean = false
  ): d3.Arc<any, d3.DefaultArcObject> => { // Relationship between padAngle and radius see: https://github.com/d3/d3-shape#arc_padAngle
    const cornerRadiusValue = annulusIndex === 2 ? 4 : 0
    let padAngleValue = (1.0 / (annulusIndex + 1)) * 0.01
    let outerRadiusValue = radius / 3 * (annulusIndex + 1)
    let innerRadiusValue = 3

    if (focus) {
      innerRadiusValue = innerRadiusValue  + 14
      padAngleValue = padAngleValue * 14
      outerRadiusValue = outerRadiusValue + 14
    }
    return d3.arc()
             .padAngle(padAngleValue)
             .innerRadius(innerRadiusValue)
             .cornerRadius(cornerRadiusValue)
             .outerRadius(outerRadiusValue)
  }

  const backgroundG = g.append('g').attr('class', 'background')


  const quadrantG = backgroundG.append('g').attr('class', 'background-circle')
                                           .selectAll('path')
                                           .data(arcs)
                                           .enter()
                                             .append('g')
                                             .attr('class', (d, i) => `quadrant-${i}`)

  quadrantG.selectAll('path')
         .data((d, i) => [{d, i}, {d, i}, {d, i}])
         .enter().append('path')
         .attr('class', (_, i) => `annulus-${i}`)
         .style('fill', '#AAAAAA')
         .attr('d', ({ d }, i) => (arcConfig(i) as any)(d) )
         .style('fill-opacity', (d, i) => (0.7 - 0.2 * i))
         .style('z-index', 0)
         .on('mouseover', ({ i }) => {  // i is quadrant index, j is annulusIndex
           hoverInQuadrantEffect(g, i)
           hoverOnQuadrant(i)
         })
         .on('mouseout', ({ i }) => {
           hoverOutQuadrantEffect(g, i)
         })
}
