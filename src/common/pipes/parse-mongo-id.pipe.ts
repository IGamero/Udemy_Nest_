import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

// Autogenerado con el CLI usanod el comando "nest g pi common/pipes/parseMongoId"

// Checkea que el parametro sea de tipo mongoId
@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!isValidObjectId(value))
      throw new BadRequestException(
        `${metadata.type}(${metadata.data}) ${value} is not a valid mongoId.`,
      );

    return value;
  }
}
