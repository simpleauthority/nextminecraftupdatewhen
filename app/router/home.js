import express from 'express'
import calcDaysBetween from '../util/daysBetween'
import versions from '../versions'
import moment from 'moment'

export default function() {
  const router = express.Router()
  const daysBetween = calcDaysBetween(versions)

  const daysOnly = daysBetween.map(obj => obj.days)
  const avgDays = calcAvgDays(daysOnly)
  const stdDev = calcStdDev(daysOnly, avgDays)

  const lastRelease = daysBetween[daysBetween.length - 1]
  const lastReleaseDaysAgo = moment().diff(lastRelease.date, 'days')

  let minDays = avgDays - stdDev;
  minDays = minDays < 0 ? 0 : minDays;
  minDays = minDays === 0 ? 0 : minDays - lastReleaseDaysAgo;

  let maxDays = avgDays + stdDev;
  maxDays = maxDays - lastReleaseDaysAgo;

  router.get('/', function(req, res, next) {
    res.render('home', { 
      avgDays, 
      stdDev, 
      lastReleaseName: lastRelease.name,
      lastReleaseDaysAgo,
      minDays,
      maxDays,
    })
  })

  return router
}

// simple average of input array, rounded to nearest int
function calcAvgDays(arr) {
  return Math.round(arr.reduce((total, next) => total + next) / arr.length);
}

// square-root of average of square of each number minus average 
// of original numbers (standard deviation), rounded to nearest int
function calcStdDev(arr, mu) {
  return Math.round(Math.sqrt(calcAvgDays(
      arr.map(days => 
        Math.pow(
          days - mu, 
          2
        )
      )
  )))
}
