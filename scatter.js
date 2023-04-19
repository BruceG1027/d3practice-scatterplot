const req = new XMLHttpRequest()
req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', 'true')
req.send()
req.onload = function() {
    let dataset = JSON.parse(req.responseText)
    console.log(dataset);

    const w = 1600
    const h = 1000
    const padding = 100

    // 时间转换函数
    function timeCovert(timeString) {
        let timeArray = timeString.split(':')
        return parseInt(timeArray[0]) * 60 + parseInt(timeArray[1])
    }

    function timeBack(time) {
        let second = parseInt(time/60)
        let mSecond = parseInt(time)%60
        mSecond = mSecond<10 ? '0'+mSecond : mSecond
        // return toString(second) + ":" + toString(mSecond)
        return second + ':' + mSecond;
    }
    // console.log(timeCovert('39:45'));

    const svg = d3.select('.view')
        .append('svg')
        .attr('width', w)
        .attr('height', h)
        // .style('background-color', 'pink')

    // console.log(d3.min(dataset, (d) => d.Time))
    // 比例尺
    const xScale = d3.scaleLinear()
                    .domain([d3.min(dataset, (d) => d.Year)-1, d3.max(dataset, (d) => d.Year)+1])
                    .range([padding, w - padding])
    
    const yScale = d3.scaleLinear()
                    .domain([d3.min(dataset, (d) => timeCovert(d.Time)) - 2, d3.max(dataset, (d) => timeCovert(d.Time)) + 2])
                    .range([padding, h - padding])

    // 绘制标签
    const label = d3.select('.view')
                    .append('div')
                    .attr('class', 'label')

    // 绘制散点图
    svg.selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', (d) => xScale(d.Year))
        .attr('cy', (d) => yScale(timeCovert(d.Time)))
        .attr('r', '8')
        .attr('fill', (d) => d.Doping == 0 ? 'rgb(76, 146, 195)' : 'rgb(255, 153, 62)')
        .on('mouseover', (d) =>{
            label
            .html(d.Name + ': '+ d.Nationality
              + '<br>Year: ' + d.Year 
              + ' Time: ' + d.Time 
              + (d.Doping ? '<br><br>'  + d.Doping : '' ))
            .style('opacity', 1)
            .style('top', yScale(timeCovert(d.Time))-40 + 'px')
            .style('left', (xScale(d.Year))+ 14 + 'px')
            .style('background-color', d.Doping == 0 ? 'rgba(184, 202, 225, 0.9)' : 'rgba(255,182,118, 0.9)')
        })
        .on('mouseout', () => {
            label
            .style('opacity', 0)
            .style('top', -100 + 'px')
            .style('left', 0)
        })


    // 绘制数轴
    const xAxis= d3.axisBottom(xScale).ticks(20).tickFormat(d3.format('c'))
    const yAxis = d3.axisLeft(yScale).ticks(10)
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0,' + (h-padding) + ')')
        .call(xAxis)
    
    svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', 'translate(' + padding + ',0)')
        .call(yAxis)

    svg.select('.y-axis')
        .selectAll('text')
        .text((d) => timeBack(d))
    
    svg.selectAll('text')
        .attr('font-size', 16)

    svg.select('.x-axis')
        .select('text')
        .text('')

    // svg.select('.y-axis')
    //     .select('g.tick:nth-child(12)')
    //     .text('')
    
    svg.select('.y-axis')
        .lower()
        .selectAll('line')
        .attr('x2', w - 2 * padding)
        .attr('stroke', '#000')
        .attr('stroke-dasharray', '2')
        .attr('opacity', 0.3)

    // 添加图例
    let legendContainer = svg.append('g')
                            .attr('class', 'legendContainer')

    let legend = legendContainer
                .selectAll('#legend')
                .data(['rgb(76, 146, 195)', 'rgb(255, 153, 62)'])
                .enter()
                .append('g')
                .attr('transform', 'translate(' + (w-200) + ', 328)')

    legend.append('text')
            .text((d) => 
                d == 'rgb(76, 146, 195)' ? 'No Doping Allegations' : 'Riders with doping allegations'
            )
            .attr('y', (d, i) => i*43 + 26)
            .attr('x', -20)
            .style('text-anchor', 'end')
            .style('font-size', 20 + 'px')

    legend.append('rect')
            .attr('width', 40)
            .attr('height', 40)
            .attr('y', (d, i) => i*43)
            .attr('fill', (d) => d)


    // 添加补充文字
    svg.append('text')
        .attr('class', 'y-label')
        .attr('transform', 'rotate(-90), translate(' + (padding-450) + ',' + (padding-70) + ')')
        .attr('font-size', 36)
        .attr('font-weight', 'large')
        .text('Time Minute')
    
    svg.append('text')
        .attr('class', 'source')
        .attr('transform', 'translate(800,' + (h-20) + ')')
        .attr('font-size', 16 + 'px')
        .text('数据来源：https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')

}