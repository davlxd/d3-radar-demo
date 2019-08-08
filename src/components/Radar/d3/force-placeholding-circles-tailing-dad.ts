import { PlaceHoldingCircle } from './draw-blips'

export default () => {
  let nodes: PlaceHoldingCircle[]
  const force = () => {
    nodes.forEach(node => {
      if (node.hasOwnProperty('name')){
        return
      }
      const dadX = node.dad.x + (node.dad.vx || 0)
      const dadY = node.dad.y + (node.dad.vy || 0)
      const dadRadius = node.dad.radius
      const quadrantIndex = node.dad.quadrantIndex
      const nodeRadius = node.radius
      if (quadrantIndex === 0 ) {
        node.x = dadX + dadRadius + node.nth * nodeRadius * 2 + nodeRadius
        node.y = dadY - nodeRadius / 2
      } else if (quadrantIndex === 1) {
        node.x = dadX + dadRadius + node.nth * nodeRadius * 2 + nodeRadius
        node.y = dadY + nodeRadius / 2
      } else if (quadrantIndex === 2) {
        node.x = dadX - (dadRadius + node.nth * nodeRadius * 2 + nodeRadius)
        node.y = dadY + nodeRadius / 2
      } else if (quadrantIndex === 3) {
        node.x = dadX - (dadRadius + node.nth * nodeRadius * 2 + nodeRadius)
        node.y = dadY - nodeRadius / 2
      }
    })
  }

  force.initialize = (_: PlaceHoldingCircle[]) => nodes = _

  return force
}
