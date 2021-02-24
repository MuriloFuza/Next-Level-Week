import { Request, Response } from 'express'
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurviesRepository";

class SurveyController {

  async create(request: Request, response: Response) {
    const { title, description } = request.body;

    const surveyRepository = await getCustomRepository(SurveysRepository);

    const survey = surveyRepository.create({
      title,
      description
    })

    await surveyRepository.save(survey);

    return response.status(201).json(survey);
  }

  async show(request: Request, response: Response) {

    const surveyRepository = await getCustomRepository(SurveysRepository);

    const surveys = await surveyRepository.find();

    if (!surveys) {
      return response.json('Table surveys is empty');
    }
    return response.status(201).json(surveys); // Status = 201 -> Create ok

  }

}

export { SurveyController };
