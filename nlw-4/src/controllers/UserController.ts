import { Request, Response } from 'express';
import { getCustomRepository, Not } from 'typeorm';
import * as yup from 'yup';
import { UsersRepository } from '../repositories/UsersRepository';
import { AppError } from '../erros/AppErro';

class UserController {

  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required("Nome é obrigatorio"),
      email: yup.string().email().required("Email é obrigatorio")
    })

    try {
      await schema.validate(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err })
    }

    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await usersRepository.findOne({
      email,
    })

    if (userAlreadyExists) {
      throw new AppError('User already exists!');
    }

    const user = usersRepository.create({
      name,
      email
    })

    await usersRepository.save(user);

    return response.status(201).json(user); // Status = 201 -> Create ok
  }

  async showAll(request: Request, response: Response) {

    const usersRepository = getCustomRepository(UsersRepository);

    const users = await usersRepository.find();

    if (!usersRepository) {
      return response.json('Table users is empty');
    }
    return response.status(201).json(users); // Status = 201 -> Create ok

  }

  async showUsersActive(request: Request, response: Response) {

    const usersRepository = getCustomRepository(UsersRepository);

    const users = await usersRepository.find({
      mail_replied: Not(0),
    });

    if (!usersRepository) {
      return response.json('Table users is empty');
    }
    return response.status(201).json(users); // Status = 201 -> Create ok

  }
}

export { UserController };

