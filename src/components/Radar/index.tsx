import React, { FC, useState, useEffect } from 'react'
import initateSvg from './d3/initate-svg'
import drawBackgroundCirclesAndAxis from './d3/draw-background-circles-and-axis'
import drawQuadrantLabels from './d3/draw-quadrant-labels'
import drawBlips from './d3/draw-blips'

import './Radar.css'

export interface Blip {
  quadrant: string,
  name: string,
  score: number,
  badge?: string,
  desc?: string,
}
interface RadarProps {
  blips: Blip[]
}

interface RadarState {
  svgId: string,
  highlightedQuadrantIndex: number,
  simulationRefs: any[], //TODO
}

// const refreshD3Drawing = (
//   svgId: string,
//   blips: RadarProps[], //TODO merge to state
//   highlightedQuadrantIndex: number,
//   simulationRefs: any[],
//   setValues: React.Dispatch<React.SetStateAction<RadarState>>,
const refreshD3Drawing = (
  blips: Blip[],
  state: RadarState,
  setState: React.Dispatch<React.SetStateAction<RadarState>>,
) => {
  const { svgId } = state
  const DEFAULT_RADAR_WIDTH = 800
  const DEFAULT_RADAR_HEIGHT = 600
  const radius = Math.min(DEFAULT_RADAR_WIDTH / 2, DEFAULT_RADAR_HEIGHT / 2) * 0.95
  const quadrantNames = [...Array.from(new Set<string>(blips.map(blip => blip.quadrant)))]
  
  // simulationRefs.forEach(sim => sim.stop())
  
  const highlightQuadrant = (quadrantIndex: number) => setState({
    ...state,
     highlightedQuadrantIndex: quadrantIndex
  })
   
  // const clickOnBlip = (quadrant: string, name: string) => this.clickOnBlip(quadrant, name)

  const g = initateSvg(svgId, DEFAULT_RADAR_WIDTH, DEFAULT_RADAR_HEIGHT)
  drawBackgroundCirclesAndAxis(g, DEFAULT_RADAR_WIDTH, DEFAULT_RADAR_HEIGHT, radius, quadrantNames, highlightQuadrant)
  drawQuadrantLabels(g, radius, quadrantNames, highlightQuadrant)
  drawBlips(g, radius, blips, highlightQuadrant, () => ({}))
  // this.simulationRefs.simulation = simulation
  // this.simulationRefs.simulation2 = simulation2
}

const Radar: FC<RadarProps> = ({ blips }) => {
  const [state, setState] = useState<RadarState>({
    svgId: 'radar-chart-svg',
    highlightedQuadrantIndex: 0,
    simulationRefs: [],
  })

  useEffect(() => { //TODO test only blips changes triggers
    refreshD3Drawing(blips, state, setState)
  }, [blips]) // eslint-disable-line react-hooks/exhaustive-deps 

  return (
    <div className="Radar">
      <div>
        <svg id={state.svgId} />
      </div>
    </div>
  )
}

export default Radar
