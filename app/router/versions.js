import express from 'express'
import calcDaysBetween from '../util/daysBetween'
import versions from '../versions'

export default function() {
    const router = express.Router()
    const daysBetween = calcDaysBetween(versions).map(obj => ({
      ...obj, 
      date: obj.date.format("MMMM Do, YYYY")
    }))
    
    router.get('/versions.json', function(req, res, next) {
        res.json(daysBetween)
    })

    return router
}