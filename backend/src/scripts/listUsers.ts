import { getDataSource } from '../infrastructure/database';
import { User } from '../domain/entities/User';

async function findUser(email: string) {
    const dataSource = getDataSource();

    try {
        if (!dataSource.isInitialized) {
            await dataSource.initialize();
            console.log('Database connection initialized');
        }

        const userRepository = dataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: { email },
            select: ['id', 'firstName', 'lastName', 'email', 'isAdmin', 'isActive', 'lastLoginAt', 'createdAt', 'updatedAt']
        });

        if (user) {
            console.log('\nUser found:');
            console.table(user);
        } else {
            console.log('\nNo user found with email:', email);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
            console.log('Database connection closed');
        }
    }
}

findUser("test12@gmail.com").catch(console.error); 