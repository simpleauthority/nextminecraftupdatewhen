export default (versions) => {
    const daysBetween = []
  
    let previous = undefined
    for (const version of versions) {
      if (!previous) {
        daysBetween.push({
          name: version.name,
          date: version.date,
          days: 0
        })
        
        previous = version
        continue
      }
  
      const current = version
      daysBetween.push({
        name: version.name,
        date: version.date,
        days: current.date.diff(previous.date, 'days')
      })
  
      // prepare for next iteration
      previous = current
    }

    return daysBetween
}