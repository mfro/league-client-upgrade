declare module "rcp-fe-lol-login/v1" {
    import Ember from 'rcp-fe-ember-libs/v1';
    import * as Login from 'rcp-be-lol-login/v1';

    export interface LoginComponent extends Ember.Component<{
        session: Login.Session;
        password: string;
    }> { }
}