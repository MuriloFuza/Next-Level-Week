import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { SurveysRepository } from "../repositories/SurviesRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from '../services/SendMailService';
import { resolve } from 'path';

class SendMailController {

  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = await getCustomRepository(UsersRepository);
    const surveysRepository = await getCustomRepository(SurveysRepository);
    const surveysUsersRepository = await getCustomRepository(SurveysUsersRepository);

    const userAlreadyExists = await usersRepository.findOne({
      email,
    })
    if (!userAlreadyExists) {
      return response.status(400).send({ error: 'User does not exists!' })
    }

    const surveyAlreadyExists = await surveysRepository.findOne({
      id: survey_id,
    })
    if (!surveyAlreadyExists) {
      return response.status(400).send({ error: 'Survey does not exists!' })
    }

    const variables = {
      name: userAlreadyExists.name,
      title: surveyAlreadyExists.title,
      description: surveyAlreadyExists.description,
      user_id: userAlreadyExists.id,
      link: process.env.URL_MAIL
    }
    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

    const surveyUserAlreadyExist = await surveysUsersRepository.findOne({
      where: [{
        user_id: userAlreadyExists.id,
        survey_id
      }],
      relations: ['user', 'survey']
    })

    if (surveyUserAlreadyExist) {
      await SendMailService.execute(email, surveyAlreadyExists.title, variables, npsPath);
      return response.json(surveyUserAlreadyExist)
    }

    //Salvar as informações na tabela surveyUser - 1°
    const surveyUser = surveysUsersRepository.create({
      user_id: userAlreadyExists.id,
      survey_id
    })
    await surveysUsersRepository.save(surveyUser);

    //Enviar e-meial para o Usuário - 2°

    await SendMailService.execute(email, surveyAlreadyExists.title, variables, npsPath);

    return response.json(surveyUser);
  }

}

export { SendMailController }