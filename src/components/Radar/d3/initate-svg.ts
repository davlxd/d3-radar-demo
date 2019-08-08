import * as d3 from 'd3'

export default (
  svgId: string, 
  width: number, 
  height: number
): d3.Selection<SVGGElement, unknown, HTMLElement, any> => {
  const svg = d3.select(`#${svgId}`)
                  .attr('id', svgId)
                  .attr('width', width)
                  .attr('height', height)
                  .style('user-select', 'none')
  
  svg.select('g').remove()
  
  const g = svg.append('g')
               .attr('transform', `translate(${width/2}, ${height/2})`)
  
  return g
}
