'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/',  controller.index);
router.delete('/:id',  controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(),controller.changePassword);
router.get('/:id',  controller.show);
router.post('/', controller.create);
//update user
router.put('/:id',controller.upsert);
//get all users late fees
//router.get('/latefees', controller.latefees);
module.exports = router;
