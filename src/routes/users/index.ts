import { Router } from "express";
import AuthService from "../../services/AuthService";

// Controller de usuario
import * as Controller from '../../controllers/users'

const auth = new AuthService()

export const UserRouter = Router()

/**
 * Visualizacion de usuarios
 * @param  {Request} req
 * @param  {Response} res
 */
UserRouter.get('/', (req, res) => {
    Controller.getAllUsers(req, res)
})

/**
 * Visualizacion de usuarios
 * @param  {Request} req
 * @param  {Response} res
 */
UserRouter.post('/', (req, res) => {
    Controller.createUser(req, res)
})

/**
 * Visualizacion de usuarios
 * @param  {Request} req
 * @param  {Response} res
 */
UserRouter.post('/login-web', (req, res) => {
    Controller.login(req, res)
})

UserRouter.post('/refreshLogin', (req, res) => {
    Controller.refreshLogin(req, res)
})

