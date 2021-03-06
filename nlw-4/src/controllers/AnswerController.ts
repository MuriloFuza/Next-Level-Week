import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../erros/AppErro";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import UpdateUserReplied from '../services/UpdateUserRepliedService';
import ClassificationService from '../services/ClassificationService';


class AnswerController {

  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { u } = request.query;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveysUsersRepository.findOne({
      id: String(u)
    })

    if (!surveyUser) {
      throw new AppError('Survey User does not exists!');
    }

    surveyUser.value = Number(value);

    await surveysUsersRepository.save(surveyUser);
    await ClassificationService.execute(String(surveyUser.user_id));
    await UpdateUserReplied.execute(String(surveyUser.user_id));

    return response.json(surveyUser);
  }

}

export { AnswerController }