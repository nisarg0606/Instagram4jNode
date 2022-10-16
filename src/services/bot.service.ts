import { IgApiClient, MediaRepositoryLikersResponseUsersItem } from 'instagram-private-api';
import { config } from 'dotenv';
export default class BotService {
    ig: IgApiClient;
    user: string;
    password: string;
    constructor() {
        config();
        this.user = process.env.USER;
        this.password = process.env.PASS;
        this.ig = new IgApiClient();
        console.log(this.user);
        console.log(this.password);
        
    }

    async login() {
        this.ig.state.generateDevice(this.user);
        await this.ig.simulate.preLoginFlow();
        const loggedInAccount = await this.ig.account.login(this.user, this.password);
        await this.ig.simulate.postLoginFlow();
        console.log('logged in as: ', loggedInAccount.username);
        console.log('logged in..');
    }
}