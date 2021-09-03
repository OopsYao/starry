import React, { useState, useEffect } from 'react'
import * as d3Selection from 'd3-selection'
import * as d3Force from 'd3-force'
import uniqueId from 'lodash/uniqueId'

const d3 = { ...d3Selection, ...d3Force }
export default ({ nodes, links }) => {
    const [nodeId] = useState(uniqueId('svg-'))
    const [textId] = useState(uniqueId('svg-'))
    const [linkId] = useState(uniqueId('svg-'))
    const [width, height] = [1000, 1000]

    useEffect(() => {
        const d3Links = links.map(({ from: source, to: target }) => ({ source, target }))
        const node = d3.select(`#${nodeId}`)
            .selectAll('circle').data(nodes).enter().append('circle')
            .attr('r', 18)

        const text = d3.select(`#${textId}`)
            .selectAll('text').data(nodes).enter().append('text')
            .text(({ id }) => id)

        const link = d3.select(`#${linkId}`)
            .selectAll('polyline').data(links).enter().append('polyline')

        const simulation = d3
            .forceSimulation(nodes)
            .force('link', d3.forceLink(d3Links).id(({ id }) => id))
            .force('charge', d3.forceManyBody())
            .force('center', d3.forceCenter(width / 2, height / 2))
        simulation.on('tick', () => {
            node.attr('cx', (d) => d.x).attr('cy', (d) => d.y)
            text.attr('x', (d) => d.x).attr('y', (d) => d.y)
            link.attr(
                'points',
                ({ source: { x: x1, y: y1 }, target: { x: x2, y: y2 } }) => {
                    return [
                        [x1, y1],
                        [(x1 + x2) / 2, (y1 + y2) / 2],
                        [x2, y2],
                    ].map((arr) => arr.join(',')).join(' ')
                },
            )
        })
    }, [])
    return (<svg viewBox={[0, 0, width, height].join(' ')}>
        <g id={nodeId} />
        <g id={textId} />
        <g id={linkId} />
    </svg>)
}
