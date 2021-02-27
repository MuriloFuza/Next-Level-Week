import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class Classification {

  async execute(id: string) {
    let media = 0;
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findOne({
      id
    });

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
    const surveys = await surveysUsersRepository.find({
      user_id: id
    })

    for (let i = 0; i < surveys.length; i += 1) {
      const value = Number(surveys[i].value);
      console.log(value);
      media += value;
    }
    media = (media / surveys.length);

    if (media >= 0 && media <= 6) {
      user.classification = "detractor";
    }
    if (media >= 7 && media <= 8) {
      user.classification = "passive";
    }
    if (media >= 9 && media <= 10) {
      user.classification = "promoter";
    }

    await usersRepository.save(user);
  }

}

export default new Classification();