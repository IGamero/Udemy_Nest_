import { ForbiddenException } from '@nestjs/common';

export const dev_setAll_FieldToValue = async (
  model,
  field: string,
  value: any,
) => {
  if (process.env.ENVIROMENT && !process.env.ENVIROMENT.includes('dev')) {
    throw new ForbiddenException(
      'This method is only available in development mode',
    );
  }
  try {
    const result = await model.updateMany({}, { [field]: value });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
