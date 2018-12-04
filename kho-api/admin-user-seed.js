// eslint-disable
const { app } = require('./dist/app.js');
const { ROLE } = require('./dist/enums');
const models = app.get('models');

const User = models.User;
const Warehouse = models.Warehouse;

(async () => {
    try {
        const admin = await User.findOne({ role: ROLE.ADMIN });

        if (!admin) {
            const rootAdmin = new User({
                name: 'ROOT ADMIN',
                username: 'admin',
                password: 'admin',
                email: 'admin@demo.com',
                role: ROLE.ADMIN,
            });

            await rootAdmin.save();
        }

        await Warehouse.create([
            {name: 'WAREHOUSE 01'},
            {name: 'WAREHOUSE 02'},
            {name: 'WAREHOUSE 03'},
            {name: 'WAREHOUSE 04'},
            {name: 'WAREHOUSE 05'},
        ]);

        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(0);
    }
})();
