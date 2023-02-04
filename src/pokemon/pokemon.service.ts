import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { InternalServerErrorException } from '@nestjs/common/exceptions/internal-server-error.exception';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private configService: ConfigService
  ) {
    this.defaultLimit = this.configService.get('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon; 
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll({limit = this.defaultLimit, offset = 0}: PaginationDto) {
    const pokemonList = await this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1,
      })
      .select('-__v');
    return pokemonList;
  }

  async findOne(term: string): Promise<Pokemon> {
    let pokemon: Pokemon;
    if(!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({no: term});
    }
    
    if(!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    };

    if(!pokemon) {
      pokemon = await this.pokemonModel.findOne({name: term});
    }

    if(!pokemon) {
      throw new NotFoundException(`It wasn't found a pokemon with name, no or id: ${term}`);
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon: Pokemon = await this.findOne(term);
    if(updatePokemonDto?.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    
    try {
      await pokemon.updateOne(updatePokemonDto);
      return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string): Promise<void> {
    // await this.pokemonModel.findByIdAndDelete(id);
    const { deletedCount } = await this.pokemonModel.deleteOne({_id: id});

    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id: ${id} was not found`);
    };

    return;
  }

  handleExceptions(error: any): HttpException {
    if(error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in DB ${JSON.stringify(error.keyValue.no)}`);
    };
    throw new InternalServerErrorException(`Can't create pokemon - Check server logs`);
  }
}
