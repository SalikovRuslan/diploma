import { AccountContainerInterface } from './account-container.interface';

export interface IReadableUserModel extends AccountContainerInterface {
    _id: string;
    uId: string;
    date: Date;
}
