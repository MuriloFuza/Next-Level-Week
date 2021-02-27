import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";

class UpdateUserReplied {

  async execute(id: string) {
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findOne({
      id
    });

    try {
      user.mail_replied += 1;
      await usersRepository.save(user);
    } catch (error) {
      console.log(error);
    }
  }

}

export default new UpdateUserReplied(); 