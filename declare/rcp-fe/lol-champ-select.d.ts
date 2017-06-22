declare module "rcp-fe-lol-champ-select/v1" {
    import Ember from 'rcp-fe-ember-libs/v1';
    import * as ChampSelect from 'rcp-be-lol-champ-select/v1';

    export interface ChampSelectComponent extends Ember.Component<{
        session: ChampSelect.Session;
        'session.myTeam': ChampSelect.Cell[];
    }> { }
}