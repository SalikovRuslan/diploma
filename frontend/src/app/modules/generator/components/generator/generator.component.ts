import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { getRandomIntInclusive } from '../../../shared/utils/random';
import { Clipboard } from '@angular/cdk/clipboard';
import { SnackBarService } from '../../../shared/services/snack-bar.service';

interface GeneratorForm {
    length: number;
    lowercase: boolean;
    uppercase: boolean;
    numbers: boolean;
    symbols: boolean;
}

@Component({
    selector: 'app-generator',
    templateUrl: './generator.component.html',
    styleUrls: ['./generator.component.less'],
})
export class GeneratorComponent implements OnInit {
    passwordLengthControl: AbstractControl;
    generatedPassword: string;
    formGroup: FormGroup;

    private fullDictionary = {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPWRSTUVWXYZ',
        numbers: '0123456789',
        symbols: "!@#$%^&*-_=+\\|:;',.<>/?~",
    };

    constructor(private fb: FormBuilder, private clipboard: Clipboard, private snackBarService: SnackBarService) {}

    ngOnInit(): void {
        const config = this.getConfig();
        this.formGroup = this.fb.group({
            length: [config.length],
            lowercase: [config.lowercase],
            uppercase: [config.uppercase],
            numbers: [config.numbers],
            symbols: [config.symbols],
        });

        this.passwordLengthControl = this.formGroup.get('length');

        this.formGroup.valueChanges.subscribe((value: GeneratorForm) => {
            // если все чекбоксы сняты, то выбрать один из них
            if (!value.lowercase && !value.uppercase && !value.numbers && !value.symbols) {
                this.formGroup.get('lowercase').setValue(true, { emitEvent: false });
            }

            this.generatePassword();
        });

        this.generatePassword();
    }

    copyPassword() {
        this.clipboard.copy(this.generatedPassword);
        this.snackBarService.show('Скопійовано', 'OK');
    }

    generatePassword() {
        const form = this.formGroup.value;

        const symbolsMaxLength = 5;
        const dictionary = this.sortRandomlyArray([
            ...(form.lowercase ? this.fullDictionary.lowercase : []),
            ...(form.uppercase ? this.fullDictionary.uppercase : []),
            ...(form.numbers ? this.fullDictionary.numbers : []),
            // 5 случайных символов, таким образом их будет меньше в пароле
            ...(form.symbols ? this.sortRandomlyArray([...this.fullDictionary.symbols]).splice(0, symbolsMaxLength) : []),
        ]);

        let password = '';

        for (let i = 0; i < this.passwordLength; i++) {
            password += dictionary[getRandomIntInclusive(0, dictionary.length - 1)];
        }

        this.generatedPassword = password;
        this.saveConfig();
    }

    get passwordLength() {
        return this.passwordLengthControl.value;
    }

    private sortRandomlyArray(array: any[]) {
        return array.sort(() => 0.5 - Math.random());
    }

    private saveConfig() {
        localStorage.setItem('passwordGeneratorConfig', JSON.stringify(this.formGroup.value));
    }

    private getConfig(): GeneratorForm {
        const configString = localStorage.getItem('passwordGeneratorConfig');
        let config;
        try {
            config = JSON.parse(configString);
        } catch (e) {}

        return {
            length: config?.length ?? 10,
            lowercase: config?.lowercase ?? true,
            uppercase: config?.uppercase ?? true,
            numbers: config?.numbers ?? true,
            symbols: config?.symbols ?? false,
        };
    }
}
