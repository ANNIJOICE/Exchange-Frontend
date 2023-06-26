import { Injectable } from '@angular/core';
import { Environment } from '@exchange/types';

export let environment: Environment = {
  production: false,
  apiBase: 'http://localhost:4200/api'
};

@Injectable({
  providedIn: 'root'
})
export class EnvironmentServices {
  setEnvironment(env: Environment): void {
    environment = env;
  }

  getEnvironment(): Environment {
    return environment;
  }
}
