const express = require('express')
const router = express.Router({ mergeParams: true })
const asyncError = require('../utils/asyncError.js')
const { validateAttendance, objectIdMiddleware } = require('../middleware.js')
const attendance = require('../controllers/attendance')


router.route('/')
    .get(objectIdMiddleware, asyncError(attendance.home))
    .post(objectIdMiddleware, validateAttendance, asyncError(attendance.post))

router.route('/new')
    .get( objectIdMiddleware, asyncError(attendance.new))

router.route('/:dateId')
    .get(objectIdMiddleware, asyncError(attendance.show))
    .put(objectIdMiddleware, asyncError(attendance.put))
    .delete(objectIdMiddleware, asyncError(attendance.delete))
    
router.route('/:dateId/edit')
    .get(objectIdMiddleware, asyncError(attendance.edit))


module.exports = router