const bcrypt = require('bcryptjs');

const plainPassword = 'Admin@123';
const hashedPassword = '$2b$10$tvuU0WlREjG1x9P0xunxwOGYpQg5xz/j4i9DS7xfcUJ5i9nrcMNda';

bcrypt.compare(plainPassword, hashedPassword).then((isMatch) => {
  console.log("Manual bcrypt match:", isMatch);
});
