export class UserModel {
    email: string;
    name: string;
    status: string;
    logoutTime: number;
    accessToken: string;
    cryptToken: string;

    constructor(props?: any) {
        if (!!props) {
            this.email = props.email;
            this.name = props.name;
            this.status = props.status;
            this.logoutTime = props.logoutTime;
            this.accessToken = props.accessToken;
            this.cryptToken = props.cryptToken;
        }
    }
}
