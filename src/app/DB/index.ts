import { UserRole } from '../modules/user/user.constant';
import { User } from '../modules/user/user.model';

const admin = {
  name: 'Rahat Ashik',
  email: 'admin@mail.com',
  password: '123456',
  role: UserRole.admin,
  bio: 'I am an seeded admin',
  profilePicture:
    'https://res.cloudinary.com/damvwxpdq/image/upload/v1719337899/2030020003-Rahat.jpg',
};

const seedAdmin = async () => {
  //when database is connected, we will check is there any user who is admin
  const isAdminExits = await User.findOne({ role: UserRole.admin });

  if (!isAdminExits) {
    await User.create(admin);
  }
};

export default seedAdmin;
