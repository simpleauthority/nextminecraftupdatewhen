import express from 'express'
import moment from 'moment'
import versions from './versions'

export default function() {
  const router = express.Router()

  const daysBetweenEachVersion = []
  
  let previous = undefined
  for (const version of versions) {
    if (!previous) {
      // first version, there are 0 days between the "previous" release and this one, so we are skipping it
      previous = version
      continue
    }

    const current = version
    daysBetweenEachVersion.push(current.date.diff(previous.date, 'days'))

    // prepare for next iteration
    previous = current
  }

  const avgDays = calcAvg(daysBetweenEachVersion)
  const stdDev = calcStdDev(daysBetweenEachVersion, avgDays)

  const lastReleaseDaysAgo = moment().diff(previous.date, 'days')
  const avgDiff = avgDays - lastReleaseDaysAgo
  const stdDevDiff = stdDev - lastReleaseDaysAgo

  let minDays = avgDiff - stdDevDiff;
  minDays = minDays < 0 ? 0 : minDays;

  const maxDays = avgDiff + stdDevDiff;

  router.get('/', function(req, res, next) {
    res.render('home', { 
      avgDays, 
      stdDev, 
      lastReleaseName: previous.name,
      lastReleaseDaysAgo,
      minDays,
      maxDays,
    })
  })

  return router
}

function momentify(version) {
  return {
    name: version.name,
    date: moment(version.date)
  }
}

// simple average of input array, rounded to nearest int
function calcAvg(arr) {
  return Math.round(arr.reduce((total, next) => total + next) / arr.length);
}

// square-root of average of square of each number minus average 
// of original numbers (standard deviation), rounded to nearest int
function calcStdDev(arr, mu) {
  return Math.round(Math.sqrt(calcAvg(
      arr.map(days => 
        Math.pow(
          days - mu, 
          2
        )
      )
  )))
}
