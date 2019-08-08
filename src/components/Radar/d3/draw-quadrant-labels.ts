import { hoverInQuadrantEffect, hoverOutQuadrantEffect } from './quadrant-hover-effect'


export default (
  g: d3.Selection<SVGGElement, unknown, HTMLElement, any>, 
  radius: number, 
  quadrantNames: string[],
  hoverOnQuadrant: (quadrantIndex: number) => void
): void => {
  const quadrantLabelsG = g.append('g').attr('class', 'quadrant-labels')

  const eachQuadrantLabel = quadrantLabelsG.selectAll('text')
                                           .data(quadrantNames)
                                           .enter()
                                             .append('text')
                                             .attr('class', (d, i) => `quadrant-label-${i}`)
                                             .attr('x', (d, i) => Math.sin(Math.PI/4) * radius * (i === 0 || i === 1 ? 1 : -1))
                                             .attr('y', (d, i) => Math.sin(Math.PI/4) * radius * (i === 1 || i === 2 ? 1 : -1))
                                             .attr('font-size', '1.5em')
                                             .attr('font-weight', 200)
                                             .text(d => d.toUpperCase())
                                             .on('mouseover', (d, i) => {
                                               hoverInQuadrantEffect(g, i)
                                               hoverOnQuadrant(i)
                                             })
                                             .on('mouseout', (d, i) => {
                                               hoverOutQuadrantEffect(g, i)
                                             })

  const quadrantLabelBBox = (index: number) => eachQuadrantLabel.nodes()[index].getBBox()

  eachQuadrantLabel.attr('dx', (d, i) =>  (i === 0 || i === 1 ? 0 : -quadrantLabelBBox(i).width))
  eachQuadrantLabel.attr('dy', (d, i) =>  (i === 0 || i === 3 ? 0 : 0.5 * quadrantLabelBBox(i).height))
}
