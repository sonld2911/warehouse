'use strict';

import { Router } from 'express';
import { authenticate } from '../auth';
// import { UploadAvatarMiddleware } from '../middleware';

import { UserCreateMiddleware } from '../middleware';

import {
    MeController,
    AuthController,
    UserController,
    // AvatarController,
    WarehouseController,
    PurchaseOrderController,
    ProductController,
} from '../controllers';

const routes = Router();

routes.use('/me', authenticate());
routes.get('/me', MeController.profile);
routes.patch('/me', MeController.changeProfile);

routes.post('/auth/login', AuthController.login);

routes.use('/users', authenticate());
routes.get('/users', UserController.list);
routes.get('/users/:id', UserController.findOne);
routes.post('/users', UserController.create);
routes.patch('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.remove);

routes.use('/purchase-orders', authenticate());
routes.get('/purchase-orders', PurchaseOrderController.find);
routes.get('/purchase-orders/invoice_management', PurchaseOrderController.invoiceManagement);
routes.get('/purchase-orders/assignees', PurchaseOrderController.getAssignees);
routes.get('/purchase-orders/:id', PurchaseOrderController.findOne);
routes.post('/purchase-orders', PurchaseOrderController.create);
routes.patch('/purchase-orders/:id', PurchaseOrderController.update);
routes.delete('/purchase-orders/:id', PurchaseOrderController.remove);
routes.patch('/purchase-orders/invoice-approval/:id', PurchaseOrderController.invoiceApproval);


/*routes.post('/avatars',
    authenticate(),
    UploadAvatarMiddleware,
    AvatarController.upload
);*/


routes.use('/warehouses', authenticate());
routes.get('/warehouses', WarehouseController.list);
routes.post('/warehouses', WarehouseController.create);
routes.patch('/warehouses/:id', WarehouseController.update);
routes.delete('/warehouses/:id', WarehouseController.remove);

routes.use('/products', authenticate());
routes.get('/products', ProductController.find);
routes.get('/products/:id', ProductController.findOne);
routes.post('/products', ProductController.create);
routes.patch('/products/:id', ProductController.update);
routes.delete('/products/:id', ProductController.remove);

export {
    routes as apiRoutes,
};
