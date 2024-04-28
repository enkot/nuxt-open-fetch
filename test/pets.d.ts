export interface paths {
  '/pet': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    /**
     * Update an existing pet
     * @description Update an existing pet by Id
     */
    put: operations['updatePet']
    /**
     * Add a new pet to the store
     * @description Add a new pet to the store
     */
    post: operations['addPet']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/pet/{petId}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Find pet by ID
     * @description Returns a single pet
     */
    get: operations['getPetById']
    put?: never
    /** Updates a pet in the store with form data */
    post: operations['updatePetWithForm']
    /** Deletes a pet */
    delete: operations['deletePet']
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}
export type webhooks = Record<string, never>
export interface components {
  schemas: {
    Pet: {
      /**
       * Format: int64
       * @example 10
       */
      id?: number
      /** @example doggie */
      name: string
      category?: components['schemas']['Category']
      photoUrls: string[]
      tags?: components['schemas']['Tag'][]
      /**
       * @description pet status in the store
       * @enum {string}
       */
      status?: 'available' | 'pending' | 'sold'
    }
    ApiResponse: {
      /** Format: int32 */
      code?: number
      type?: string
      message?: string
    }
  }
  responses: never
  parameters: never
  requestBodies: {
    /** @description Pet object that needs to be added to the store */
    Pet: {
      content: {
        'application/json': components['schemas']['Pet']
        'application/xml': components['schemas']['Pet']
      }
    }
  }
  headers: never
  pathItems: never
}
export type $defs = Record<string, never>
export interface operations {
  updatePet: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** @description Update an existent pet in the store */
    requestBody: {
      content: {
        'application/json': components['schemas']['Pet']
        'application/xml': components['schemas']['Pet']
        'application/x-www-form-urlencoded': components['schemas']['Pet']
      }
    }
    responses: {
      /** @description Successful operation */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/xml': components['schemas']['Pet']
          'application/json': components['schemas']['Pet']
        }
      }
      /** @description Invalid ID supplied */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Pet not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Validation exception */
      405: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  addPet: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** @description Create a new pet in the store */
    requestBody: {
      content: {
        'application/json': components['schemas']['Pet']
        'application/xml': components['schemas']['Pet']
        'application/x-www-form-urlencoded': components['schemas']['Pet']
      }
    }
    responses: {
      /** @description Successful operation */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/xml': components['schemas']['Pet']
          'application/json': components['schemas']['Pet']
        }
      }
      /** @description Invalid input */
      405: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  getPetById: {
    parameters: {
      query?: never
      header?: never
      path: {
        /** @description ID of pet to return */
        petId: number
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description successful operation */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          'application/xml': components['schemas']['Pet']
          'application/json': components['schemas']['Pet']
        }
      }
      /** @description Invalid ID supplied */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
      /** @description Pet not found */
      404: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  updatePetWithForm: {
    parameters: {
      query?: {
        /** @description Name of pet that needs to be updated */
        name?: string
        /** @description Status of pet that needs to be updated */
        status?: string
      }
      header?: never
      path: {
        /** @description ID of pet that needs to be updated */
        petId: number
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Invalid input */
      405: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
  deletePet: {
    parameters: {
      query?: never
      header?: {
        api_key?: string
      }
      path: {
        /** @description Pet id to delete */
        petId: number
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Invalid pet value */
      400: {
        headers: {
          [name: string]: unknown
        }
        content?: never
      }
    }
  }
}
