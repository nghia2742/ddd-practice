import { ApplicationException } from './application.exception';

/**
 * Exception thrown when a resource is not found
 */
export class NotFoundException extends ApplicationException {
  constructor(resourceName: string, identifier: string | number) {
    super(
      `${resourceName} with identifier '${identifier}' not found`,
      'RESOURCE_NOT_FOUND',
      404,
    );
  }
}
