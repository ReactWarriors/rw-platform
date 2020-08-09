import { Injectable } from '@nestjs/common';
import {
  ClientProxyFactory,
  Transport,
  ClientProxy,
} from '@nestjs/microservices';
import { LandingDTO } from './landing.dto';

@Injectable()
export class LandingService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 8877,
      },
    });
  }

  createLanding(data: LandingDTO, userId: string): any {
    return this.client.send('create_landing', { data, userId });
  }

  getAllUserLandings(userId) {
    return this.client.send('get_all_user_landings', userId);
  }

  getLanding(landingId, userId) {
    return this.client.send('get_landing', {
      landingId,
      userId,
      role: 'student',
    });
  }

  updateLanding(landingId, userId, data) {
    return this.client.send('update_landing', {
      landingId,
      userId,
      data,
      role: 'student',
    });
  }

  deleteLanding(landingId, userId) {
    return this.client.send('delete_landing', {
      landingId,
      userId,
      role: 'student',
    });
  }
}
