const settings_namespace = 'zhonya-settings';

export default class BooleanSetting {
    private _context: any;
    private _property: string;
    private _label: string;

    constructor(property: string, label: string, settingsApi: any, group: string, scope = 'local') {
        this._property = property;
        this._label = label;

        this._context = settingsApi.registerSettings(settings_namespace, group, 1, scope);
        this._context.setRenderer(this.render.bind(this));
    }

    private render(settings: any) {
        let uikit = document.createElement('lol-uikit-flat-checkbox');
        uikit.classList.add('lol-settings-general-row');
        uikit.setAttribute('for', this._property);

        let input = document.createElement('input');
        input.type = 'checkbox';
        input.name = this._property;
        input.checked = (settings && settings[this._property]) || false;

        let label = document.createElement('label');
        label.classList.add('lol-settings-checkbox-label');
        label.textContent = this._label;

        uikit.appendChild(input);
        uikit.appendChild(label);

        uikit.addEventListener('checkboxToggle', () => this.save(input.checked));

        return uikit;
    }

    private save(value: boolean) {
        this._context.saveSettings({ [this._property]: value });
    }
}