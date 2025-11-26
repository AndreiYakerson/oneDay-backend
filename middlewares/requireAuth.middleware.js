import { config } from '../config/index.js'
import { logger } from '../services/logger.service.js'
import { asyncLocalStorage } from '../services/als.service.js'

export function requireAuth(req, res, next) {
    const { loggedinUser } = asyncLocalStorage.getStore()
    req.loggedinUser = loggedinUser

    if (config.isGuestMode && !loggedinUser) {
        req.loggedinUser = { _id: '', fullname: 'Guest' }
        return next()
    }
    if (!loggedinUser) return res.status(401).send('Not Authenticated')
    next()
}

export function requireAdmin(req, res, next) {
    const { loggedinUser } = asyncLocalStorage.getStore()

    if (!loggedinUser) return res.status(401).send('Not Authenticated')
    if (!loggedinUser.isAdmin) {
        logger.warn(loggedinUser.fullname + 'attempted to perform admin action')
        res.status(403).end('Not Authorized')
        return
    }
    next()
}

export function requireOwner(req, res, next) {
    const { loggedinUser } = asyncLocalStorage.getStore()
    const { body: board } = req

    if (!loggedinUser || !board) return res.status(401).send('Not Authenticated')

    if (loggedinUser._id !== board.owner._id) {
        logger.warn(loggedinUser.fullname + ' attempted to perform owner action')
        return res.status(403).send('Not your board')
    }

    next()
}
