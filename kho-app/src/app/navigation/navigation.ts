import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'applications',
        title: 'Applications',
        translate: 'NAV.APPLICATIONS',
        type: 'group',
        children: [
            {
                id: 'dashboard',
                title: 'Dashboard',
                translate: 'NAV.DASHBOARD',
                type: 'item',
                icon: 'dashboard',
                url: '/dashboard',
            },
        ],
    },
    {
        id: 'warehouse-management',
        title: 'Warehouse Management',
        translate: 'NAV.WAREHOUSE_MANAGEMENT',
        type: 'group',
        children: [
            // {
            //     id: 'warehouse-list',
            //     title: 'Warehouse List',
            //     translate: 'NAV.WAREHOUSE_LIST',
            //     type: 'item',
            //     icon: 'move_to_inbox',
            //     url: '/warehouse/list',
            // },
            {
                id: 'products',
                title: 'Product Management',
                translate: 'NAV.PRODUCT_MANAGEMENT',
                type: 'item',
                icon: 'shopping_basket',
                url: '/products',
            },
            {
                id: 'warehouse-import',
                title: 'Warehouse Import',
                translate: 'NAV.WAREHOUSE_IMPORT',
                type: 'item',
                // icon: 'subdirectory_arrow_right',
                url: '/warehouse/import',
            },
            {
                id: 'warehouse-export',
                title: 'Warehouse Export',
                translate: 'NAV.WAREHOUSE_EXPORT',
                type: 'item',
                // icon: 'subdirectory_arrow_right',
                url: '/warehouse/export',
            },
            // {
            //     id: 'warehouse-export',
            //     title: 'Warehouse Export',
            //     translate: 'NAV.WAREHOUSE_EXPORT',
            //     type: 'item',
            //     icon: 'subdirectory_arrow_left',
            //     url: '/warehouse/export',
            // },
        ],
    },
    {
        'id': 'admins',
        'title': 'Admin management',
        'translate': 'NAV.ADMIN',
        'type': 'group',
        'children': [
            {
                id: 'admin-user',
                title: 'User Management',
                translate: 'NAV.USER',
                type: 'item',
                icon: 'account_circle',
                url: '/admin/users',
            },
            {
                id: 'admin-warehouse',
                title: 'Warehouse Management',
                translate: 'NAV.WAREHOUSE',
                type: 'item',
                icon: 'account_balance',
                url: '/admin/warehouses',
            },
        ],
    },
    {
        'id': 'approver',
        'title': 'Approver management',
        'translate': 'NAV.APPROVER',
        'type': 'group',
        'children': [
            {
                id: 'approver-input',
                title: 'Approver management',
                translate: 'NAV.APPROVER_INPUT',
                type: 'item',
                icon: 'input',
                url: '/admin/users',
                badge    : {
                    title    : '25',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
            },
            {
                id: 'approver-output',
                title: 'Approver management',
                translate: 'NAV.APPROVER_OUTPUT',
                type: 'item',
                icon: 'assignment_return',
                url: '/admin/warehouses',
                badge    : {
                    title    : '13',
                    bg       : '#EC0C8E',
                    fg       : '#FFFFFF'
                }
            },
        ],
    },
];
