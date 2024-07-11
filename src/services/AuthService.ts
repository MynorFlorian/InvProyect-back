import { secret, saltRounds } from '../globals'
import basicAuthLib from 'basic-auth';
import * as globals from '../globals';
import jwt from 'jsonwebtoken';

// Models


// Variables
var bcrypt = require('bcryptjs');

export default class AuthService {

    basicAuth(username:string, password:string) {
        return function (req:any, res:any, next:any) {
            var user = basicAuthLib(req);

            if (!user || user.name !== username || user.pass !== password) {
                res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
                return res.sendStatus(401);
            }

            next();
        };
    };

    validate(permisos:any) {
        let validar = this.autenticarToken.bind(this);
        return function (req:any, res:any, next:any) {
            return validar(req, res, next, permisos);
        }
    };

    autenticarToken (req:any, res:any, next:any, permisos: string[]) {
        try {
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) throw new Error('401');

            const token = authorizationHeader.split(' ')[1];
            let result = jwt.verify(token, globals.secret);

            let accesoValido = false;
            permisos.forEach(permiso => {
                accesoValido = accesoValido || this.validarPermisos(result, permiso);
            });

            if (!accesoValido) throw new Error('403');
            req.decoded = result;
            let tokenData:any = this.getTokenData(result);
            if (!tokenData) throw new Error('403');

            req.tokenData = tokenData;
            next();
        } catch (err:any) {
            let result = {
                error: true,
                message: '',
                status: 0
            };

            switch (err.message) {
                case '403': {
                    result.message = 'No cuenta con los permisos necesarios para acceder a la ruta.';
                    result.status = 403;
                    //return res.status(403).send(result);
                    return res.status(403).send({ error: true, message: result.message });
                }
                case '401':
                default: {
                    result.message = 'Error de autenticación. Por favor vuelva a iniciar sesión.';
                    result.status = 401;
                    return res.status(401).send({ error: true, message: result.message });
                    //return res.status(401).send(result);
                }
            }
        }
    }

    validarPermisos = function (token:any, permiso:any) {
        // Validar datos
        if (!token || !token.Rol) return false;

        var usuario = token;
        var rol: any = usuario.Rol;

        if (!permiso) return true;

        // Captura de strings permisos
        var accesosRol = rol.permisos ? JSON.parse(rol.permisos) : [];

        // Verificación de permisos
        if (accesosRol && accesosRol.includes(permiso)) return true;

        return false;
    }

    getTokenData(token:any) {
        return (!token || !token.Rol) ? null : {
            UsuarioId: token.id,
            RolId: token.Rol.id,
            invitado: token.invitado
        };
    }

    async encryptPassword(password:string){
        const salt = await bcrypt.genSalt(saltRounds)
        return await bcrypt.hash(password, salt)
    }

    async comparePassword (receivedPassword:any, password:any){
        return await bcrypt.compare(receivedPassword, password)
    }

    generateToken(usuario:any, dias: number = 1){
        return jwt.sign(usuario, secret, {
            expiresIn: 86400 * dias
        })
    }

}
