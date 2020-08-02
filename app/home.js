import express from 'express'
import moment, { version } from 'moment'
import version_dates from './version_dates'
import periods from './periods'

export default function() {
  const router = express.Router()

  const daysBetweenEachVersion = []
  
  let previous = undefined
  for (const version_date of version_dates) {
    if (!previous) {
      // first version, there are 0 days between the "previous" release and this one, so we are skipping it
      previous = moment(version_date)
      continue
    }

    const current = moment(version_date)
    daysBetweenEachVersion.push(current.diff(previous, 'days'))

    // prepare for next iteration
    previous = current
  }

  const avgDays = calcAvg(daysBetweenEachVersion)
  const stdDev = calcStdDev(daysBetweenEachVersion, avgDays)

  const lastReleaseDaysAgo = daysBetweenEachVersion[daysBetweenEachVersion.length - 1]
  let avgDiff = avgDays - lastReleaseDaysAgo;
  let stdDevDiff = stdDev - lastReleaseDaysAgo;

  let estimate;
  if (avgDiff <= 0) {
    estimate = stdDevDiff;
  }



  router.get('/', function(req, res, next) {
    res.render('home', { 
      avgDays, 
      stdDev, 
      lastReleaseDaysAgo,
      avgDiff,
      stdDevDiff
    })
  })

  return router
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
